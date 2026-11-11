// Mock plans for the 購買 list (銷售方案管理 + 儲值方案管理); replace with API data.

/** 方案類型 (購買選單設定), in tab order, with the `?type=` slug used in the URL. */
export const PLAN_TYPES = [
  { type: "會籍卡", slug: "train" },
  { type: "團體課", slug: "classes" },
  { type: "私教課", slug: "private" },
  { type: "數據服務", slug: "data" },
  { type: "儲值金", slug: "point" },
] as const

export type PlanType = (typeof PLAN_TYPES)[number]["type"]

/**
 * 購買類型, from the plan's 會籍: 體驗 = 體驗會籍; 堂數制／定期制 (月份制)／訂閱制 = 會籍種類. A plan can carry
 * 體驗 and a 會籍種類 at once. 儲值金 has none.
 */
export const BUY_TYPES = ["體驗", "堂數制", "定期制", "訂閱制"] as const
export type BuyType = (typeof BUY_TYPES)[number]

/**
 * 一次付清: no 定期定額／訂閱制 allowed. 定期定額: `count` periods, the first one now. 訂閱制: every 月／週 until
 * cancelled. `first` can include a one-off fee on top of `each`.
 */
export type Payment =
  | { kind: "once"; total: number }
  | { kind: "installment"; first: number; each: number; count: number }
  | { kind: "subscription"; period: "月" | "週"; first: number; each: number }

export type Plan = {
  id: string
  type: PlanType
  buyTypes: BuyType[]
  title: string
  payment: Payment
  /** 每人限購數量. */
  perPersonLimit?: number
  /** 限制銷售數量, and how many have sold. */
  stock?: { limit: number; sold: number }
  /** 贈送會籍 names (一般方案). */
  gifts?: string[]
  /** 回饋金 (儲值金). */
  reward?: number
  /** Venues selling this plan; omitted = every venue. */
  venues?: string[]
  /** 銷售期間 (yyyy-mm-dd, inclusive); no end = open-ended. */
  saleStart: string
  saleEnd?: string
  /** 開放 APP 線上銷售. */
  online: boolean
  /** Tie-break for 最新上架. */
  createdAt: string
}

/** 營業據點, sorted by 場館 ID. */
export const SHOP_VENUES = [
  { id: 1, name: "市府館" },
  { id: 2, name: "中山旗艦館" },
  { id: 3, name: "信義館" },
  { id: 4, name: "大安館" },
  { id: 5, name: "內湖館" },
].sort((a, b) => a.id - b.id)

export const ALL_VENUE_NAMES = SHOP_VENUES.map((v) => v.name)

export const plans: Plan[] = [
  // ——— 會籍卡 ———
  {
    id: "trial-day",
    type: "會籍卡",
    buyTypes: ["體驗", "堂數制"],
    title: "單日體驗入場",
    payment: { kind: "once", total: 0 },
    perPersonLimit: 1,
    saleStart: "2026-11-01",
    online: true,
    createdAt: "2026-10-28T10:00",
  },
  {
    id: "monthly",
    type: "會籍卡",
    buyTypes: ["訂閱制"],
    title: "月費訂閱制",
    payment: { kind: "subscription", period: "月", first: 1188, each: 888 },
    gifts: ["教練課體驗 1 堂"],
    saleStart: "2026-10-15",
    online: true,
    createdAt: "2026-10-10T09:00",
  },
  {
    id: "weekly",
    type: "會籍卡",
    buyTypes: ["訂閱制"],
    title: "週週練週訂閱",
    payment: { kind: "subscription", period: "週", first: 299, each: 299 },
    venues: ["市府館", "信義館", "內湖館"],
    saleStart: "2026-11-05",
    online: true,
    createdAt: "2026-11-01T09:00",
  },
  {
    id: "yearly",
    type: "會籍卡",
    buyTypes: ["定期制"],
    title: "年約會籍",
    payment: { kind: "installment", first: 888, each: 888, count: 12 },
    gifts: ["置物櫃月租", "毛巾租借"],
    venues: ["市府館", "中山旗艦館", "信義館"],
    saleStart: "2026-09-01",
    online: true,
    createdAt: "2026-08-20T09:00",
  },
  {
    id: "off-peak",
    type: "會籍卡",
    buyTypes: ["定期制"],
    title: "離峰半年會籍",
    payment: { kind: "once", total: 5880 },
    stock: { limit: 30, sold: 22 },
    venues: ["市府館", "大安館", "內湖館"],
    saleStart: "2026-10-01",
    online: true,
    createdAt: "2026-09-25T09:00",
  },
  {
    // 銷售期間已過: not listed.
    id: "summer",
    type: "會籍卡",
    buyTypes: ["定期制"],
    title: "暑期三個月會籍",
    payment: { kind: "once", total: 3600 },
    saleStart: "2026-06-01",
    saleEnd: "2026-09-30",
    online: true,
    createdAt: "2026-05-20T09:00",
  },

  // ——— 團體課 ———
  {
    id: "group-trial",
    type: "團體課",
    buyTypes: ["體驗", "堂數制"],
    title: "團課體驗 1 堂",
    payment: { kind: "once", total: 199 },
    perPersonLimit: 1,
    saleStart: "2026-10-20",
    online: true,
    createdAt: "2026-10-18T09:00",
  },
  {
    id: "yoga-10",
    type: "團體課",
    buyTypes: ["堂數制"],
    title: "瑜珈 10 堂課程卡",
    payment: { kind: "once", total: 4500 },
    perPersonLimit: 2,
    stock: { limit: 50, sold: 38 },
    saleStart: "2026-11-08",
    online: true,
    createdAt: "2026-11-06T09:00",
  },
  {
    id: "pilates-8",
    type: "團體課",
    buyTypes: ["堂數制"],
    title: "器械皮拉提斯 8 堂",
    payment: { kind: "once", total: 6400 },
    venues: ["中山旗艦館", "大安館"],
    saleStart: "2026-10-01",
    online: true,
    createdAt: "2026-09-28T09:00",
  },
  {
    id: "group-unlimited",
    type: "團體課",
    buyTypes: ["定期制"],
    title: "團課暢上 3 個月",
    payment: { kind: "installment", first: 2980, each: 2980, count: 3 },
    gifts: ["瑜珈墊"],
    venues: ["市府館", "信義館", "內湖館"],
    saleStart: "2026-10-01",
    online: true,
    createdAt: "2026-09-30T09:00",
  },
  {
    // 未開放 APP 線上銷售: not listed.
    id: "group-counter",
    type: "團體課",
    buyTypes: ["堂數制"],
    title: "櫃台限定團課 20 堂",
    payment: { kind: "once", total: 8000 },
    saleStart: "2026-10-01",
    online: false,
    createdAt: "2026-09-30T10:00",
  },

  // ——— 私教課 ———
  {
    id: "pt-trial",
    type: "私教課",
    buyTypes: ["體驗", "堂數制"],
    title: "一對一教練課首堂體驗",
    payment: { kind: "once", total: 999 },
    perPersonLimit: 1,
    saleStart: "2026-10-01",
    online: true,
    createdAt: "2026-09-29T09:00",
  },
  {
    id: "pt-12",
    type: "私教課",
    buyTypes: ["堂數制"],
    title: "一對一教練課 12 堂",
    payment: { kind: "installment", first: 2800, each: 2800, count: 6 },
    gifts: ["體組成量測 2 次", "伸展放鬆 1 堂"],
    saleStart: "2026-10-25",
    online: true,
    createdAt: "2026-10-24T09:00",
  },
  {
    id: "pt-duo-8",
    type: "私教課",
    buyTypes: ["堂數制"],
    title: "一對二教練課 8 堂",
    payment: { kind: "once", total: 14400 },
    saleStart: "2026-10-25",
    online: true,
    createdAt: "2026-10-23T09:00",
  },
  {
    // 已售完: not listed.
    id: "pt-flash",
    type: "私教課",
    buyTypes: ["堂數制"],
    title: "雙 11 私教 5 堂快閃",
    payment: { kind: "once", total: 4999 },
    stock: { limit: 10, sold: 10 },
    saleStart: "2026-11-01",
    online: true,
    createdAt: "2026-10-30T09:00",
  },

  // ——— 數據服務 ———
  {
    id: "inbody-3",
    type: "數據服務",
    buyTypes: ["堂數制"],
    title: "InBody 體組成量測 3 次",
    payment: { kind: "once", total: 600 },
    saleStart: "2026-10-10",
    online: true,
    createdAt: "2026-10-08T09:00",
  },
  {
    id: "data-monthly",
    type: "數據服務",
    buyTypes: ["訂閱制"],
    title: "訓練數據追蹤月訂閱",
    payment: { kind: "subscription", period: "月", first: 199, each: 199 },
    saleStart: "2026-11-02",
    online: true,
    createdAt: "2026-11-01T10:00",
  },

  // ——— 儲值金 ———
  {
    id: "credit-1000",
    type: "儲值金",
    buyTypes: [],
    title: "儲值 $1,000",
    payment: { kind: "once", total: 1000 },
    saleStart: "2026-11-10",
    online: true,
    createdAt: "2026-11-09T09:00",
  },
  {
    id: "credit-3000",
    type: "儲值金",
    buyTypes: [],
    title: "儲值 $3,000",
    payment: { kind: "once", total: 3000 },
    reward: 300,
    saleStart: "2026-09-01",
    online: true,
    createdAt: "2026-08-30T09:00",
  },
  {
    id: "credit-10000",
    type: "儲值金",
    buyTypes: [],
    title: "儲值 $10,000",
    payment: { kind: "once", total: 10000 },
    reward: 1500,
    perPersonLimit: 1,
    stock: { limit: 100, sold: 64 },
    saleStart: "2026-09-01",
    online: true,
    createdAt: "2026-08-30T10:00",
  },
]

// ——— Rules ———

const pad = (n: number) => String(n).padStart(2, "0")
export const todayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Listed only when 銷售期間有效, 開放 APP 線上銷售 and 尚有可售數量. */
export function isOnSale(plan: Plan, today = todayKey()) {
  const inPeriod = plan.saleStart <= today && (!plan.saleEnd || today <= plan.saleEnd)
  const inStock = !plan.stock || plan.stock.sold < plan.stock.limit
  return inPeriod && plan.online && inStock
}

export const planInVenue = (plan: Plan, venue: string | null) =>
  venue === null || !plan.venues || plan.venues.includes(venue)

/** 首次支付的總額 (一般方案) / 支付總額 (儲值金): what 價格 sorting compares. */
export const firstPayment = (plan: Plan) => (plan.payment.kind === "once" ? plan.payment.total : plan.payment.first)

export const SORTS = [
  { key: "newest", label: "最新上架" },
  { key: "price-asc", label: "價格低到高" },
  { key: "price-desc", label: "價格高到低" },
] as const
export type SortKey = (typeof SORTS)[number]["key"]

export function sortPlans(list: Plan[], sort: SortKey) {
  return [...list].sort((a, b) => {
    if (sort === "price-asc") return firstPayment(a) - firstPayment(b)
    if (sort === "price-desc") return firstPayment(b) - firstPayment(a)
    // 最新上架: later 銷售期間開始日 first, then later 建立時間.
    return b.saleStart.localeCompare(a.saleStart) || b.createdAt.localeCompare(a.createdAt)
  })
}

// ——— Card copy ———

export const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`

/** 金額: 免費 / $總計 / $首次付款金額. */
export const priceLabel = (plan: Plan) => (firstPayment(plan) === 0 ? "免費" : formatPrice(firstPayment(plan)))

/** 輔助說明 under the price for 定期定額／訂閱制. */
export function priceHint(plan: Plan) {
  const p = plan.payment
  if (p.kind === "installment") {
    return `首付${formatPrice(p.first)}，次月起 ${formatPrice(p.each)}，共 ${p.count} 個月`
  }
  if (p.kind === "subscription") {
    return `首付${formatPrice(p.first)}，次${p.period}起每期 ${formatPrice(p.each)}`
  }
  return null
}

/** 搶購文案: 每人限購 N 組｜剩餘 N 組 (either part only when set). */
export function scarcityLabel(plan: Plan) {
  const parts = []
  if (plan.perPersonLimit) parts.push(`每人限購 ${plan.perPersonLimit} 組`)
  if (plan.stock) parts.push(`剩餘 ${plan.stock.limit - plan.stock.sold} 組`)
  return parts.length ? parts.join("｜") : null
}

/** 加贈項目: 再贈A、B (一般方案) / 贈送回饋金 $N (儲值金). */
export function giftLabel(plan: Plan) {
  if (plan.type === "儲值金") return plan.reward ? `贈送回饋金 ${formatPrice(plan.reward)}` : null
  return plan.gifts?.length ? `再贈${plan.gifts.join("、")}` : null
}
