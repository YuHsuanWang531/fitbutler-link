// Mock 方案內容 data (what the back office sets per plan) and the checkout rules; replace with API data.

import { plans, SHOP_VENUES, type Plan } from "@/lib/shop-plans"

/** Mock member state until login exists. */
export const MOCK_MEMBER = { loggedIn: true, storedBalance: 3200 }

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

/** A｜一般方案 (會籍／團課／私課) vs B｜儲值方案. */
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
      /** 訂閱制: first period now, then automatic every 月／週; `count` = periods in total (omitted = 應繳 1 期). */
      subscription: { period: "月" | "週"; count?: number } | null
    }
  | { kind: "stored"; items: MoneyLine[]; validity: string }

type GeneralOverrides = Partial<Extract<PlanDetail, { kind: "general" }>>

const GENERAL: Record<string, GeneralOverrides> = {
  monthly: {
    usage: "訂閱制・不限次數／1 月",
    benefits: ["全日自由進出場館", "免費使用置物櫃與淋浴間", "贈教練課體驗 1 堂，購買後 30 天內使用"],
    activation: { kind: "member", days: 8 },
    contract: true,
    subscription: { period: "月" },
  },
  yearly: {
    usage: "月份制・每期不限次數／12 月",
    benefits: ["全日自由進出場館", "可暫停會籍 1 次，最長 30 天", "免費使用置物櫃與淋浴間"],
    activation: { kind: "fixed", date: "2026/12/01" },
    venueRule: { selectable: true, max: 2 },
    contract: true,
  },
  "all-access": {
    usage: "訂閱制・不限次數／1 月",
    benefits: ["所有分館皆可進出", "免費使用置物櫃與淋浴間"],
    contract: true,
    subscription: { period: "月", count: 12 },
  },
  "off-peak": {
    usage: "訂閱制・不限次數／1 月",
    benefits: ["平日 10:00–17:00、假日全天可進出", "離峰時段以外入場需另付單次費用"],
    activation: { kind: "member", days: 8 },
    contract: true,
    subscription: { period: "月", count: 6 },
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
    usage: "堂數制・不限堂數／30 天",
    benefits: ["所有團課皆可預約", "同時段限預約 1 堂"],
    activation: { kind: "member", days: 8 },
    venueRule: { selectable: true, max: 1 },
  },
  "pt-trial": {
    usage: "堂數制・1 堂／30 天",
    benefits: ["一對一體態評估與訓練規劃", "新會員限購 1 次"],
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
  "stretch-4": {
    usage: "堂數制・4 堂／60 天",
    benefits: ["一對一伸展與筋膜放鬆"],
  },
}

const STORED: Record<string, { items: MoneyLine[]; validity: string }> = {
  "credit-3000": {
    items: [
      { label: "儲值金額", amount: 3000 },
      { label: "贈送儲值金", amount: 300 },
    ],
    validity: "購買後 1 年內使用",
  },
  "credit-10000": {
    items: [
      { label: "儲值金額", amount: 10000 },
      { label: "贈送儲值金", amount: 1500 },
    ],
    validity: "購買後 1 年內使用",
  },
}

export function getPlan(id: string) {
  return plans.find((p) => p.id === id)
}

export function getPlanDetail(plan: Plan): PlanDetail {
  if (plan.type === "儲值") return { kind: "stored", ...(STORED[plan.id] ?? { items: [], validity: "" }) }
  return {
    kind: "general",
    usage: "",
    benefits: [],
    activation: { kind: "immediate" },
    venues: plan.venues ?? SHOP_VENUES,
    venueRule: { selectable: false },
    contract: false,
    subscription: null,
    ...GENERAL[plan.id],
  }
}

const SETUP_FEE = 300
/** 定期定額（非訂閱制）: plans from this price can be paid monthly over this many months. */
const INSTALLMENT_FROM = 5000
const INSTALLMENT_MONTHS = 6

const sum = (lines: MoneyLine[]) => lines.reduce((total, l) => total + l.amount, 0)

/**
 * 付款方式矩陣 (6.2): 一次付清, 定期定額 (非訂閱制／訂閱制) and 儲值金. Every option carries the 交易明細 the
 * back office sets; 儲值金 adds a 減項 equal to what it pays, so the total never goes below zero.
 */
export function getPaymentOptions(plan: Plan, detail: PlanDetail): PaymentOption[] {
  // B｜儲值方案: 一次付清 only.
  if (detail.kind === "stored") {
    return [
      {
        id: "once",
        label: "一次付清",
        method: "card",
        lines: [{ label: "儲值金額", amount: plan.price }],
        discounts: [],
      },
    ]
  }

  const options: PaymentOption[] = []
  let lines: MoneyLine[]
  if (detail.subscription) {
    // 訂閱制: the first period now (+ 設定費), then automatic.
    const { period, count } = detail.subscription
    lines = [
      { label: "首期費用", amount: plan.price },
      { label: "設定費", amount: SETUP_FEE },
    ]
    options.push({
      id: "recurring",
      label: "定期定額",
      method: "card",
      lines,
      discounts: [],
      // 應繳 1 期 (no count): just the per-period amount.
      hint: `次月起，每${period} ${formatMoney(plan.price)} 元${count ? `，共 ${count - 1} 個${period}` : ""}`,
    })
  } else {
    lines = [{ label: "方案費用", amount: plan.price }]
    options.push({ id: "once", label: "一次付清", method: "card", lines, discounts: [] })
    if (plan.price >= INSTALLMENT_FROM) {
      const monthly = Math.ceil(plan.price / INSTALLMENT_MONTHS)
      const first = plan.price - monthly * (INSTALLMENT_MONTHS - 1)
      options.push({
        id: "installment",
        label: "定期定額",
        method: "card",
        lines: [{ label: "首期費用", amount: first }],
        discounts: [],
        hint: `次月起，每月 ${formatMoney(monthly)} 元，共 ${INSTALLMENT_MONTHS - 1} 個月`,
      })
    }
  }

  const balance = MOCK_MEMBER.storedBalance
  options.push({
    id: "stored",
    label: `儲值金（剩餘 ${formatMoney(balance)}）`,
    method: "stored",
    lines,
    discounts: [{ label: "儲值金", amount: Math.min(balance, sum(lines)) }],
  })
  return options
}

/** 最終結帳金額: 明細 minus 減項, never negative. */
export const paymentTotal = (option: PaymentOption) => Math.max(0, sum(option.lines) - sum(option.discounts))

/** 儲值金不足: the balance has to cover the whole amount. */
export const isStoredShort = (option: PaymentOption) =>
  option.method === "stored" && MOCK_MEMBER.storedBalance < sum(option.lines)

export const formatMoney = (n: number) => `$${n.toLocaleString("en-US")}`
