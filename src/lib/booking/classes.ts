import type { ClassFilters, GymClass } from "@/lib/booking/types"
import { fromKey } from "@/lib/booking/dates"

export function classEnd(c: GymClass) {
  const [h, m] = c.start.split(":").map(Number)
  const end = fromKey(c.date)
  end.setHours(h, m + c.durationMin)
  return end
}

export function isEnded(c: GymClass, now: Date) {
  return classEnd(c) <= now
}

export function spotsLeft(c: GymClass) {
  return Math.max(0, c.capacity - c.bookedCount)
}

export function matchesFilters(c: GymClass, filters: ClassFilters) {
  return (!filters.category || c.category === filters.category) && (!filters.teacherId || c.teacher.id === filters.teacherId)
}

export function countActiveFilters(filters: ClassFilters) {
  return Number(filters.category !== null) + Number(filters.teacherId !== null)
}

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
