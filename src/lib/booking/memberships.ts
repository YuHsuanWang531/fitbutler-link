/** A membership the signed-in member can book a class with (mock until the API is in). */
export type Membership = { id: string; name: string; detail: string }

export const myMemberships: Membership[] = [
  { id: "m1", name: "團課使用方案 12 個月・不限館別團體課程", detail: "剩 6 堂｜至 2027/03/31" },
  { id: "m2", name: "兩年期月份制會籍（含飛輪、瑜伽、皮拉提斯）", detail: "至 2026/12/31" },
  { id: "m3", name: "新會員首次體驗會籍", detail: "剩 1 堂｜至 2026/11/30" },
]
