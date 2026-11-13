/** A membership the signed-in member can book a class with (mock until the API is in). */
export type Membership = { id: string; name: string; detail: string }

export const myMemberships: Membership[] = [
  { id: "m1", name: "團課 10 堂", detail: "剩 6 堂・至 2027/03/31" },
  { id: "m2", name: "月份制會籍", detail: "至 2026/12/31" },
  { id: "m3", name: "體驗會籍", detail: "剩 1 堂・至 2026/11/30" },
]
