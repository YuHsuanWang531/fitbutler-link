import type { Metadata } from "next"

import { BookingView } from "@/components/booking/booking-view"

export const metadata: Metadata = { title: "預約" }

export default function MemberBookingPage() {
  return <BookingView />
}
