// Local-time date helpers for the booking calendar. Weeks start on Sunday.

export const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"] as const

export function toKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${m}-${d}`
}

export function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function startOfWeek(date: Date) {
  return addDays(date, -date.getDay())
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Every day from `from` to `to`, inclusive. */
export function eachDay(from: Date, to: Date) {
  const days: Date[] = []
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(d)
  return days
}

/** Calendar rows (Sunday-first weeks) covering the whole month, including adjacent-month days. */
export function monthWeeks(month: Date) {
  const first = startOfMonth(month)
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
  const days = eachDay(startOfWeek(first), addDays(startOfWeek(last), 6))
  return Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7))
}

export function monthDays(month: Date) {
  const first = startOfMonth(month)
  return eachDay(first, new Date(first.getFullYear(), first.getMonth() + 1, 0))
}

/** 「2026 年 10 月」 */
export function formatMonthTitle(month: Date) {
  return `${month.getFullYear()} 年 ${month.getMonth() + 1} 月`
}

/** 「10/11 – 17」, or 「9/27 – 10/3」 across months. */
export function formatWeekTitle(weekStart: Date) {
  const end = addDays(weekStart, 6)
  const head = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`
  const tail = isSameMonth(weekStart, end) ? `${end.getDate()}` : `${end.getMonth() + 1}/${end.getDate()}`
  return `${head} – ${tail}`
}

/** 「10 月 8 日（四）」 */
export function formatDayTitle(date: Date) {
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日（${WEEKDAY_LABELS[date.getDay()]}）`
}
