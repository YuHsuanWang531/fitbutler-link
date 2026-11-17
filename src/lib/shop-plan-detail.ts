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

/** 開始使用日: shown as-is, or picked by the member within `days` from today. */
export type Activation = { kind: "immediate" } | { kind: "fixed"; date: string } | { kind: "member"; days: number }

/** A｜一般方案 (會籍卡／團體課／私教課／數據服務) vs B｜儲值方案. */
export type PlanDetail =
  | {
      kind: "general"
      /** 方案說明. */
      description: string
      /**
       * 購買內容: one line per 會籍 the plan gives (it can give several, e.g. 贈送會籍), each with its 使用天數／堂數／
       * 次數限制, e.g. 「12 堂／180 天」 or 「不限次數／每期／1 月」.
       */
      content: { name: string; usage: string }[]
      activation: Activation
      /** 可使用場館: the member picks any of them (at least one). */
      venues: string[]
      contract: boolean
    }
  | { kind: "stored"; items: MoneyLine[]; validity: string }

type GeneralOverrides = Partial<Extract<PlanDetail, { kind: "general" }>>

const GENERAL: Record<string, GeneralOverrides> = {
  "trial-day": {
    content: [{ name: "單日體驗會籍", usage: "1 次／1 天" }],
    description: "當日全時段自由進出所有器材區，可使用置物櫃、淋浴間與吹風機，第一次來也有教練帶你熟悉環境。",
  },
  monthly: {
    content: [
      { name: "月費會籍", usage: "不限次數／每期／1 月" },
      { name: "教練課體驗", usage: "1 堂／30 天" },
    ],
    description: "全日自由進出場館，免費使用置物櫃與淋浴間，每月可預約一次教練諮詢，隨時取消、當期結束後停止扣款。",
    activation: { kind: "member", days: 8 },
    contract: true,
  },
  weekly: {
    content: [{ name: "週費會籍", usage: "不限次數／每期／1 週" }],
    description: "全日自由進出場館，適合短期出差或想先試試的你，可隨時取消，當期結束後停止扣款。",
  },
  yearly: {
    content: [
      { name: "年約會籍", usage: "不限次數／每期／12 月" },
      { name: "置物櫃月租", usage: "不限次數／每期／12 月" },
      { name: "毛巾租借", usage: "不限次數／每期／12 月" },
    ],
    description: "全日自由進出場館，免費使用置物櫃與淋浴間，合約期間可暫停會籍 1 次，最長 30 天。",
    activation: { kind: "fixed", date: "2026/12/01" },
    contract: true,
  },
  "off-peak": {
    content: [{ name: "離峰會籍", usage: "不限次數／每期／6 月" }],
    description: "平日 10:00–17:00、假日全天可進出，避開下班尖峰時段，器材不用排隊，適合時間彈性的你。",
    activation: { kind: "member", days: 8 },
    contract: true,
  },
  "group-trial": {
    content: [{ name: "團課體驗", usage: "1 堂／30 天" }],
    description: "可預約任一堂團課，不限類別，第一次上課的新朋友也能輕鬆找到適合自己的運動節奏。",
  },
  "yoga-10": {
    content: [{ name: "瑜珈團課", usage: "10 堂／90 天" }],
    description: "可預約所有瑜珈團課，從流動瑜伽到陰瑜伽都能上，開課前 2 小時可免費取消。",
  },
  "pilates-8": {
    content: [{ name: "器械皮拉提斯團課", usage: "8 堂／60 天" }],
    description: "可預約器械皮拉提斯團課，小班制由老師逐一調整動作，開課前 2 小時可免費取消。",
  },
  "group-unlimited": {
    content: [
      { name: "團課無限", usage: "不限堂數／每期／3 月" },
      { name: "瑜珈墊", usage: "1 個" },
    ],
    description: "所有團課皆可預約、不限堂數，同時段限預約 1 堂，想上多少就上多少，最適合固定運動的你。",
    activation: { kind: "member", days: 8 },
  },
  "pt-trial": {
    content: [{ name: "一對一教練課", usage: "1 堂／30 天" }],
    description: "一對一體態評估與訓練規劃，教練會依你的目標與身體狀況，安排之後的訓練方向。",
  },
  "pt-12": {
    content: [
      { name: "一對一教練課", usage: "12 堂／180 天" },
      { name: "體組成量測", usage: "2 次／180 天" },
      { name: "伸展放鬆", usage: "1 堂／180 天" },
    ],
    description: "可指定教練，每堂附體組成量測，教練依你的目標安排課表，並提供飲食建議與每月進度追蹤。",
    activation: { kind: "member", days: 8 },
    contract: true,
  },
  "pt-duo-8": {
    content: [{ name: "一對二教練課", usage: "8 堂／120 天" }],
    description: "2 人同時上課、一起分攤費用，可指定教練，適合想和朋友或另一半一起運動的你。",
    contract: true,
  },
  "inbody-3": {
    content: [{ name: "InBody 體組成量測", usage: "3 次／90 天" }],
    description: "每次量測附報告解說，了解體脂、肌肉量與水分的變化，讓訓練成果看得見。",
  },
  "data-monthly": {
    content: [{ name: "數據服務", usage: "不限次數／每期／1 月" }],
    description: "訓練紀錄與身體數據趨勢圖一目了然，每月一份分析報告，幫你調整下個月的訓練重點。",
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
    description: "",
    content: [],
    activation: { kind: "immediate" },
    venues: plan.venues ?? ALL_VENUE_NAMES,
    contract: false,
    ...GENERAL[plan.id],
  }
}

const sum = (lines: MoneyLine[]) => lines.reduce((total, l) => total + l.amount, 0)
const firstOf = (p: Plan["payment"]) => (p.kind === "once" ? p.total : p.first)

/**
 * 付款方式: 一次付清, 定期定額 (非訂閱制／訂閱制) and 儲值金, in that order, each only when the plan sells it.
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

  const once = (total: number): PaymentOption => ({
    id: "once",
    label: "一次付清",
    method: "card",
    lines: [{ label: "方案費用", amount: total }],
    discounts: [],
  })
  // Always in this order: 一次付清 → 定期定額 → 儲值金, each only when the plan sells it.
  const options: PaymentOption[] = []
  if (p.kind === "once") options.push(once(p.total))
  else {
    if (plan.onceTotal !== undefined) options.push(once(plan.onceTotal))
    // 首期 = 每期金額, plus any one-off fee (設定費) the back office adds on top.
    const lines = [{ label: "首期費用", amount: Math.min(p.first, p.each) }]
    if (p.first > p.each) lines.push({ label: "設定費", amount: p.first - p.each })
    options.push({
      id: "recurring",
      label: "定期定額",
      method: "card",
      lines,
      discounts: [],
      hint:
        p.kind === "installment"
          ? `次月起，每月 ${formatMoney(p.each)} 元，共 ${p.count} 個月`
          : `次${p.period}起，每${p.period} ${formatMoney(p.each)} 元`,
    })
  }
  // 儲值金 pays what the first option charges; free plans have nothing to pay with it.
  const first = options[0]
  if (sum(first.lines) === 0) return options

  const balance = MOCK_MEMBER.storedBalance
  return [
    ...options,
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
