// Mock 方案內容 data (what the back office sets per plan) and the checkout rules; replace with API data.

import { MOCK_MEMBER } from "@/lib/mock-member"
import { ALL_VENUE_NAMES, plans, type Plan } from "@/lib/shop-plans"

export { MOCK_MEMBER }

export type MoneyLine = { label: string; amount: number }

export type PaymentOption = {
  id: string
  label: string
  /** 儲值金 needs the balance to cover the total. */
  method: "card" | "stored"
  /** 交易明細: as many lines as the back office sets. */
  lines: MoneyLine[]
  /** 減項, subtracted from the lines. */
  discounts: MoneyLine[]
  hint?: string
}

/** 會籍啟用日: shown as-is, or picked by the member within `days` from today. */
export type Activation = { kind: "immediate" } | { kind: "fixed"; date: string } | { kind: "member"; days: number }

/** 可使用場館: a fixed list, or the member picks 1 to `max`. */
export type VenueRule = { selectable: false } | { selectable: true; max: number }

/** A｜一般方案 (會籍卡／團體課／私教課／數據服務) vs B｜儲值方案. */
export type PlanDetail =
  | {
      kind: "general"
      /** 方案使用時間, already formatted per 堂數制／月份制／訂閱制. */
      usage: string
      benefits: string[]
      activation: Activation
      venues: string[]
      venueRule: VenueRule
      contract: boolean
    }
  | { kind: "stored"; items: MoneyLine[]; validity: string }

type GeneralOverrides = Partial<Extract<PlanDetail, { kind: "general" }>>

const GENERAL: Record<string, GeneralOverrides> = {
  "trial-day": {
    usage: "堂數制・1 次／1 天",
    benefits: ["當日全時段自由進出", "可使用置物櫃與淋浴間"],
  },
  monthly: {
    usage: "訂閱制・不限次數／1 月",
    benefits: ["全日自由進出場館", "免費使用置物櫃與淋浴間"],
    activation: { kind: "member", days: 8 },
    contract: true,
  },
  weekly: {
    usage: "訂閱制・不限次數／1 週",
    benefits: ["全日自由進出場館", "可隨時取消，當期結束後停止扣款"],
  },
  yearly: {
    usage: "月份制・每期不限次數／12 月",
    benefits: ["全日自由進出場館", "可暫停會籍 1 次，最長 30 天"],
    activation: { kind: "fixed", date: "2026/12/01" },
    venueRule: { selectable: true, max: 2 },
    contract: true,
  },
  "off-peak": {
    usage: "月份制・每期不限次數／6 月",
    benefits: ["平日 10:00–17:00、假日全天可進出"],
    activation: { kind: "member", days: 8 },
    contract: true,
  },
  "group-trial": {
    usage: "堂數制・1 堂／30 天",
    benefits: ["可預約任一團課"],
  },
  "yoga-10": {
    usage: "堂數制・10 堂／90 天",
    benefits: ["可預約所有瑜珈團課", "開課前 2 小時可免費取消"],
    venueRule: { selectable: true, max: 3 },
  },
  "pilates-8": {
    usage: "堂數制・8 堂／60 天",
    benefits: ["可預約器械皮拉提斯團課", "開課前 2 小時可免費取消"],
  },
  "group-unlimited": {
    usage: "月份制・每期不限堂數／3 月",
    benefits: ["所有團課皆可預約", "同時段限預約 1 堂"],
    activation: { kind: "member", days: 8 },
    venueRule: { selectable: true, max: 1 },
  },
  "pt-trial": {
    usage: "堂數制・1 堂／30 天",
    benefits: ["一對一體態評估與訓練規劃"],
  },
  "pt-12": {
    usage: "堂數制・12 堂／180 天",
    benefits: ["可指定教練", "每堂附體組成量測"],
    activation: { kind: "member", days: 8 },
    venueRule: { selectable: true, max: 1 },
    contract: true,
  },
  "pt-duo-8": {
    usage: "堂數制・8 堂／120 天",
    benefits: ["2 人同時上課", "可指定教練"],
    contract: true,
  },
  "inbody-3": {
    usage: "堂數制・3 次／90 天",
    benefits: ["每次量測附報告解說"],
  },
  "data-monthly": {
    usage: "訂閱制・不限次數／1 月",
    benefits: ["訓練紀錄與身體數據趨勢圖", "每月一份分析報告"],
  },
}

export function getPlan(id: string) {
  return plans.find((p) => p.id === id)
}

export function getPlanDetail(plan: Plan): PlanDetail {
  if (plan.type === "儲值金") {
    const amount = plan.payment.kind === "once" ? plan.payment.total : 0
    return {
      kind: "stored",
      items: [{ label: "儲值金額", amount }, ...(plan.reward ? [{ label: "贈送回饋金", amount: plan.reward }] : [])],
      validity: "購買後 1 年內使用",
    }
  }
  return {
    kind: "general",
    usage: "",
    benefits: [],
    activation: { kind: "immediate" },
    venues: plan.venues ?? ALL_VENUE_NAMES,
    venueRule: { selectable: false },
    contract: false,
    ...GENERAL[plan.id],
  }
}

const sum = (lines: MoneyLine[]) => lines.reduce((total, l) => total + l.amount, 0)
const firstOf = (p: Plan["payment"]) => (p.kind === "once" ? p.total : p.first)

/**
 * 付款方式矩陣 (6.2), driven by the plan's payment setting: 一次付清, 定期定額 (非訂閱制／訂閱制) and 儲值金.
 * 儲值金 adds a 減項 equal to what it pays, so the total never goes below zero.
 */
export function getPaymentOptions(plan: Plan, detail: PlanDetail): PaymentOption[] {
  const p = plan.payment
  // B｜儲值方案: 一次付清 only.
  if (detail.kind === "stored") {
    return [
      {
        id: "once",
        label: "一次付清",
        method: "card",
        lines: [{ label: "儲值金額", amount: firstOf(p) }],
        discounts: [],
      },
    ]
  }

  let first: PaymentOption
  if (p.kind === "once") {
    first = {
      id: "once",
      label: "一次付清",
      method: "card",
      lines: [{ label: "方案費用", amount: p.total }],
      discounts: [],
    }
  } else {
    // 首期 = 每期金額, plus any one-off fee (設定費) the back office adds on top.
    const lines = [{ label: "首期費用", amount: Math.min(p.first, p.each) }]
    if (p.first > p.each) lines.push({ label: "設定費", amount: p.first - p.each })
    first = {
      id: "recurring",
      label: "定期定額",
      method: "card",
      lines,
      discounts: [],
      hint:
        p.kind === "installment"
          ? `次月起，每月 ${formatMoney(p.each)} 元，共 ${p.count} 個月`
          : `次${p.period}起，每${p.period} ${formatMoney(p.each)} 元`,
    }
  }
  // Free plans have nothing to pay with 儲值金.
  if (sum(first.lines) === 0) return [first]

  const balance = MOCK_MEMBER.storedBalance
  return [
    first,
    {
      id: "stored",
      label: `儲值金（剩餘 ${formatMoney(balance)}）`,
      method: "stored",
      lines: first.lines,
      discounts: [{ label: "儲值金", amount: Math.min(balance, sum(first.lines)) }],
    },
  ]
}

/** 最終結帳金額: 明細 minus 減項, never negative. */
export const paymentTotal = (option: PaymentOption) => Math.max(0, sum(option.lines) - sum(option.discounts))

/** 儲值金不足: the balance has to cover the whole amount. */
export const isStoredShort = (option: PaymentOption) =>
  option.method === "stored" && MOCK_MEMBER.storedBalance < sum(option.lines)

export const formatMoney = (n: number) => `$${n.toLocaleString("en-US")}`
