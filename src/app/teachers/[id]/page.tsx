import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { TeacherProfile } from "@/components/member/teacher-profile"
import { getTeacher, teachers } from "@/lib/member-teachers"
import { teacherPrivatePlans } from "@/lib/shop-plans"

type Props = { params: Promise<{ id: string }> }

// Only the known teachers exist; any other id is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return teachers.map((teacher) => ({ id: teacher.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const teacher = getTeacher((await params).id)
  return { title: teacher ? `${teacher.name}｜老師介紹` : "老師介紹" }
}

/** 老師介紹: opened from the 老師介紹 list and a booking card's teacher. */
export default async function TeacherPage({ params }: Props) {
  const teacher = getTeacher((await params).id)
  if (!teacher) notFound()
  const teachesGroupClasses = teacher.role?.includes("團課") ?? false
  const hasPrivatePlans = teacherPrivatePlans(teacher.id).length > 0

  return (
    <>
      <MemberPageHeader title={teacher.name} fallbackHref="/teachers" />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <TeacherProfile
          teacher={teacher}
          actions={
            (teachesGroupClasses || hasPrivatePlans) && (
              <div className="flex flex-col gap-2">
                {teachesGroupClasses && (
                  <Link
                    href={`/booking?teacher=${teacher.id}`}
                    className="flex h-11 items-center justify-center rounded-[10px] bg-black text-sm font-medium text-white hover:bg-neutral-800"
                  >
                    團課內容
                  </Link>
                )}
                {hasPrivatePlans && (
                  <Link
                    href={`/shop?type=private&teacher=${teacher.id}`}
                    className="flex h-11 items-center justify-center rounded-[10px] border border-neutral-200 text-sm font-medium text-black hover:bg-neutral-50"
                  >
                    購買私教課
                  </Link>
                )}
              </div>
            )
          }
        />
      </MemberMain>
    </>
  )
}
