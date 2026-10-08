import type { GymClass, Teacher, ClassCategory } from "@/lib/booking/types"
import { mockBookingApi } from "@/lib/booking/mock-api"

/** Everything the booking page needs from the backend. Swap the implementation below for the real API. */
export interface BookingApi {
  /** Classes whose date falls in `[from, to]` (`YYYY-MM-DD`, inclusive). */
  fetchClasses(from: string, to: string): Promise<GymClass[]>
  /** Filter options for the booking page. */
  fetchFilterOptions(): Promise<{ categories: ClassCategory[]; teachers: Teacher[] }>
  book(classId: string): Promise<GymClass>
  cancelBooking(classId: string): Promise<GymClass>
  joinWaitlist(classId: string): Promise<GymClass>
  leaveWaitlist(classId: string): Promise<GymClass>
}

export const bookingApi: BookingApi = mockBookingApi
