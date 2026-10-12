import type { ClassFilters, GymClass } from "@/lib/booking/types"
import { fromKey } from "@/lib/booking/dates"

export function classEnd(c: GymClass) {
  const [h, m] = c.start.split(":").map(Number)
  const end = fromKey(c.date)
  end.setHours(h, m + c.durationMin)
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
    (filters.teacherIds.length === 0 || filters.teacherIds.includes(c.teacher.id)) &&
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

/**
 * book / waitlist: available actions. booked / waitlisted: tap to cancel.
 * ended / attended: past classes, not tappable.
 */
export type ClassAction = "book" | "booked" | "waitlist" | "waitlisted" | "ended" | "attended"

export function classAction(c: GymClass, now: Date): ClassAction {
  if (isEnded(c, now)) return c.myStatus === "booked" ? "attended" : "ended"
  if (c.myStatus === "booked") return "booked"
  if (c.myStatus === "waitlisted") return "waitlisted"
  return spotsLeft(c) > 0 ? "book" : "waitlist"
}
