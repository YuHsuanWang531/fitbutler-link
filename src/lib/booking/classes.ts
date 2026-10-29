import type { ClassFilters, GymClass } from "@/lib/booking/types"
import { fromKey } from "@/lib/booking/dates"

export function classStart(c: GymClass) {
  const [h, m] = c.start.split(":").map(Number)
  const start = fromKey(c.date)
  start.setHours(h, m)
  return start
}

export function classEnd(c: GymClass) {
  const end = classStart(c)
  end.setMinutes(end.getMinutes() + c.durationMin)
  return end
}

/** End time as `HH:mm`. */
export function classEndTime(c: GymClass) {
  const end = classEnd(c)
  return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`
}

export function isEnded(c: GymClass, now: Date) {
  return classEnd(c) <= now
}

export function spotsLeft(c: GymClass) {
  return Math.max(0, c.capacity - c.bookedCount)
}

export function matchesFilters(c: GymClass, filters: ClassFilters) {
  // `HH:mm` strings compare correctly as text.
  return (
    (filters.venues.length === 0 || filters.venues.includes(c.venue)) &&
    (filters.categories.length === 0 || filters.categories.includes(c.category)) &&
    (filters.teacherIds.length === 0 || c.teachers.some((t) => filters.teacherIds.includes(t.id))) &&
    (!filters.timeFrom || c.start >= filters.timeFrom) &&
    (!filters.timeTo || c.start < filters.timeTo)
  )
}

/** Each group with something picked counts as one condition; so does the time range, whichever ends are set. */
export function countActiveFilters(filters: ClassFilters) {
  return (
    Number(filters.venues.length > 0) +
    Number(filters.categories.length > 0) +
    Number(filters.teacherIds.length > 0) +
    Number(filters.timeFrom !== null || filters.timeTo !== null)
  )
}

/** Half-hour choices for the time filter, 06:00 – 23:00. */
export const TIME_FILTER_OPTIONS = Array.from({ length: 35 }, (_, i) => {
  const minutes = 6 * 60 + i * 30
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`
})

/** 「即將額滿」: this many spots left or fewer (rule 2-15 團體課預約即將額滿人數). */
export const ALMOST_FULL_SPOTS = 3

/**
 * What a class card shows, checked in this order:
 * close 已結束 · stop 停課 · inClass 上課中 · reserved 已預約 · waitlisted 已候補 · free 免預約 ·
 * notOpen 尚未開放 · waiting 額滿可候補 · full 額滿 · almostFull 即將額滿 · open 可預約.
 */
export type ClassStatus =
  | "close"
  | "stop"
  | "inClass"
  | "reserved"
  | "waitlisted"
  | "free"
  | "notOpen"
  | "waiting"
  | "full"
  | "almostFull"
  | "open"

export function classStatus(c: GymClass, now: Date): ClassStatus {
  if (isEnded(c, now)) return "close"
  if (c.availability === "stopped") return "stop"
  if (classStart(c) <= now) return "inClass"
  if (c.myStatus === "booked") return "reserved"
  if (c.myStatus === "waitlisted") return "waitlisted"
  if (c.availability === "free") return "free"
  if (c.availability === "notOpen") return "notOpen"
  const left = spotsLeft(c)
  if (left === 0) return c.waitlistEnabled ? "waiting" : "full"
  return left <= ALMOST_FULL_SPOTS ? "almostFull" : "open"
}

/** The card's main button: book / waitlist, or cancel what's booked. Other statuses have none. */
export type ClassAction = "book" | "booked" | "waitlist" | "waitlisted"

export function statusAction(status: ClassStatus): ClassAction | null {
  switch (status) {
    case "open":
    case "almostFull":
      return "book"
    case "waiting":
      return "waitlist"
    case "reserved":
      return "booked"
    case "waitlisted":
      return "waitlisted"
    default:
      return null
  }
}
