export type ClassCategory = "瑜伽" | "皮拉提斯" | "重訓" | "TRX" | "壺鈴"

export type Teacher = { id: string; name: string }

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

/** `null` means 全部. */
export type ClassFilters = { category: ClassCategory | null; teacherId: string | null }

export const NO_FILTERS: ClassFilters = { category: null, teacherId: null }
