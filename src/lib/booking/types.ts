export type ClassCategory =
  | "瑜伽"
  | "皮拉提斯"
  | "重訓"
  | "TRX"
  | "壺鈴"
  | "拳擊有氧"
  | "飛輪"
  | "有氧舞蹈"
  | "伸展放鬆"
  | "核心訓練"
  | "功能性訓練"

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
 * Venues, categories and teachers are multi-select: a class matches any of the picked values, and an empty
 * list means 全部. `timeFrom`/`timeTo` (`HH:mm`, half-hour steps, `null` = 不限) bound the class's start time:
 * from is inclusive, to is exclusive; either side can be open.
 */
export type ClassFilters = {
  venues: string[]
  categories: ClassCategory[]
  teacherIds: string[]
  timeFrom: string | null
  timeTo: string | null
}

export const NO_FILTERS: ClassFilters = { venues: [], categories: [], teacherIds: [], timeFrom: null, timeTo: null }
