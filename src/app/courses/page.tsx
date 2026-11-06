import type { Metadata } from "next"

import { CourseTile } from "@/components/member/course-carousel"
import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { courses } from "@/lib/booking/courses"

export const metadata: Metadata = { title: "課程介紹" }

/** The list shows the first ten for now. */
const LIST_LIMIT = 10

/** 課程介紹 list: the first ten courses, opened from the home page's 看全部. */
export default function CoursesPage() {
  return (
    <>
      <MemberPageHeader title="課程介紹" />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <ul className="grid grid-cols-2 gap-x-2 gap-y-4 px-4 py-4 md:pt-3 lg:grid-cols-3 lg:gap-x-3 lg:px-6">
          {courses.slice(0, LIST_LIMIT).map((course) => (
            <li key={course.id} className="min-w-0">
              <CourseTile course={course} sizes="(max-width: 767px) 50vw, (max-width: 1023px) 230px, 225px" />
            </li>
          ))}
        </ul>
      </MemberMain>
    </>
  )
}
