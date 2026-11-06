import type { Metadata } from "next"

import { BookingView } from "@/components/booking/booking-view"
import { getCourse } from "@/lib/booking/courses"
import { getTeacher } from "@/lib/member-teachers"

export const metadata: Metadata = { title: "預約" }

type Props = { searchParams: Promise<{ teacher?: string; course?: string }> }

/** `?teacher=<id>` (a teacher page's 團課內容) or `?course=<id>` (a course page's 預約) opens the list filtered. */
export default async function MemberBookingPage({ searchParams }: Props) {
  const { teacher, course } = await searchParams
  const teacherId = teacher && getTeacher(teacher) ? teacher : undefined
  const courseId = course && getCourse(course) ? course : undefined
  const initialFilters = { ...(teacherId && { teacherIds: [teacherId] }), ...(courseId && { courseId }) }
  // Keyed so following a filtered link (or the plain tab) starts the view fresh.
  return <BookingView key={`${teacherId ?? ""}|${courseId ?? ""}`} initialFilters={initialFilters} />
}
