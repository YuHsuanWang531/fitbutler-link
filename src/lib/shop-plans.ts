// Mock plans for the 購買 tab; replace with API data.

export type PlanType = "會籍" | "團體課程" | "私人課程" | "儲值"

export const PLAN_TYPES: PlanType[] = ["會籍", "團體課程", "私人課程", "儲值"]

export type Plan = {
  id: string
  type: PlanType
  /** Shown after the type, e.g. 「會籍 · 場館使用」. */
  subtype: string
  title: string
  description: string
  price: number
  /** Struck-through original price. */
  originalPrice?: number
  /** e.g. 「/ 月」 after the price. */
  unit?: string
  /** Highlighted note under the price (gift, purchase limit). */
  note?: string
  /** Venues selling this plan; omitted = every venue. */
  venues?: string[]
}

/** Tabs that get the 次分類 chip row under them. */
export const SUBTYPE_FILTER_TYPES: PlanType[] = ["會籍", "團體課程", "私人課程"]

export const SHOP_VENUES = ["市府館", "中山旗艦館", "信義館", "大安館", "內湖館"]

export const plans: Plan[] = [
  {
    id: "monthly",
    type: "會籍",
    subtype: "場館使用",
    title: "月費訂閱制",
    description: "免綁約、免手續費、全日自由進出",
    price: 888,
    unit: "月",
    note: "再贈教練課體驗 1 堂",
  },
  {
    id: "yearly",
    type: "會籍",
    subtype: "場館使用",
    title: "年約會籍",
    description: "12 個月・全日自由進出，可暫停 1 次",
    price: 8888,
    originalPrice: 10656,
    venues: ["市府館", "中山旗艦館", "信義館"],
  },
  {
    id: "all-access",
    type: "會籍",
    subtype: "全館通用",
    title: "全館通用月費",
    description: "所有分館皆可進出・免綁約",
    price: 1288,
    unit: "月",
  },
  {
    id: "off-peak",
    type: "會籍",
    subtype: "離峰時段",
    title: "離峰月費",
    description: "平日 10:00–17:00、假日全天可進出",
    price: 588,
    unit: "月",
    venues: ["市府館", "大安館", "內湖館"],
  },
  {
    id: "yoga-10",
    type: "團體課程",
    subtype: "瑜珈",
    title: "瑜珈 10 堂課程卡",
    description: "10 堂・購買後 90 天內使用",
    price: 4500,
    originalPrice: 5000,
  },
  {
    id: "pilates-8",
    type: "團體課程",
    subtype: "皮拉提斯",
    title: "器械皮拉提斯 8 堂",
    description: "8 堂・購買後 60 天內使用",
    price: 6400,
    originalPrice: 7200,
    venues: ["中山旗艦館", "大安館"],
  },
  {
    id: "group-unlimited",
    type: "團體課程",
    subtype: "不限類別",
    title: "團課暢上月卡",
    description: "30 天內不限堂數，所有團課皆可預約",
    price: 2980,
    venues: ["市府館", "信義館", "內湖館"],
  },
  {
    id: "pt-trial",
    type: "私人課程",
    subtype: "一對一教練課",
    title: "一對一教練課首堂體驗",
    description: "1 堂・60 分鐘",
    price: 999,
    originalPrice: 1600,
    note: "新會員限購 1 次",
  },
  {
    id: "pt-12",
    type: "私人課程",
    subtype: "一對一教練課",
    title: "一對一教練課 12 堂",
    description: "12 堂・每堂 60 分鐘・購買後 180 天內使用",
    price: 16800,
    originalPrice: 19200,
  },
  {
    id: "pt-duo-8",
    type: "私人課程",
    subtype: "一對二教練課",
    title: "一對二教練課 8 堂",
    description: "2 人同行・8 堂・每堂 60 分鐘",
    price: 14400,
    originalPrice: 16000,
    note: "兩人分攤，每人每堂 $900",
  },
  {
    id: "stretch-4",
    type: "私人課程",
    subtype: "伸展放鬆",
    title: "一對一伸展放鬆 4 堂",
    description: "4 堂・每堂 50 分鐘・購買後 60 天內使用",
    price: 5200,
    venues: ["中山旗艦館", "信義館"],
  },
  {
    id: "credit-3000",
    type: "儲值",
    subtype: "儲值金",
    title: "儲值 $3,000",
    description: "可折抵課程、會籍與館內消費",
    price: 3000,
    note: "加贈 $300 儲值金",
  },
  {
    id: "credit-10000",
    type: "儲值",
    subtype: "儲值金",
    title: "儲值 $10,000",
    description: "可折抵課程、會籍與館內消費",
    price: 10000,
    note: "加贈 $1,500 儲值金",
    venues: ["市府館", "中山旗艦館"],
  },
]

/** On sale at any of the picked venues (none picked = every plan). */
export const planInVenues = (plan: Plan, venues: string[]) =>
  venues.length === 0 || !plan.venues || plan.venues.some((v) => venues.includes(v))

export const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`
