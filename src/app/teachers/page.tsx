import type { Metadata } from "next"

import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { TeacherTile } from "@/components/member/teacher-carousel"
import { teachers } from "@/lib/member-teachers"

export const metadata: Metadata = { title: "老師介紹" }

/** The list shows the first ten for now. */
const LIST_LIMIT = 10

/** 老師介紹 list: the first ten teachers, opened from the home page's 看全部. */
export default function TeachersPage() {
  return (
    <>
      <MemberPageHeader title="老師介紹" />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <ul className="grid grid-cols-2 gap-x-2 gap-y-4 px-4 py-4 md:pt-3 lg:grid-cols-3 lg:gap-x-3 lg:px-6">
          {teachers.slice(0, LIST_LIMIT).map((teacher) => (
            <li key={teacher.id} className="min-w-0">
              <TeacherTile teacher={teacher} sizes="(max-width: 767px) 50vw, (max-width: 1023px) 230px, 225px" />
            </li>
          ))}
        </ul>
      </MemberMain>
    </>
  )
}
