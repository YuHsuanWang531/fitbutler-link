export type ClassCategory = "瑜伽" | "皮拉提斯" | "重訓" | "TRX" | "壺鈴"

/** `avatar`: image path; without one the card shows the first character of the name. */
export type Teacher = { id: string; name: string; avatar?: string }

/** The signed-in member's relation to a class. */
export type MyStatus = "none" | "booked" | "waitlisted"

export type GymClass = {
  id: string
  /** Local date `YYYY-MM-DD`. */
  date: string
  /** Local start time `HH:mm`. */
  start: string
  durationMin: number
  venue: string
  /** Room inside the venue, e.g. 「A 教室」. */
  room: string
  title: string
  category: ClassCategory
  teacher: Teacher
  capacity: number
  bookedCount: number
  myStatus: MyStatus
}

/**
 * `null` means 全部 / 不限. `timeFrom`/`timeTo` (`HH:mm`, half-hour steps) bound the class's start time:
 * from is inclusive, to is exclusive; either side can be open.
 */
export type ClassFilters = {
  venue: string | null
  category: ClassCategory | null
  teacherId: string | null
  timeFrom: string | null
  timeTo: string | null
}

export const NO_FILTERS: ClassFilters = { venue: null, category: null, teacherId: null, timeFrom: null, timeTo: null }
