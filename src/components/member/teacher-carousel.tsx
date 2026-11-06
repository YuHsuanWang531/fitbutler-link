import Image from "next/image"
import Link from "next/link"
import { UserRound } from "lucide-react"

import { SectionHeading } from "@/components/member/section-heading"
import type { Teacher } from "@/lib/booking/types"

/** 老師介紹: a sideways-scrolling row of teachers, with 看全部 opening the full list. */
export function TeacherCarousel({ teachers }: { teachers: Teacher[] }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading title="老師介紹" allHref="/teachers" />
      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:scroll-px-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
        {teachers.map((teacher) => (
          <li key={teacher.id} className="w-[150px] shrink-0 snap-start">
            <TeacherTile teacher={teacher} sizes="150px" />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Square portrait (a silhouette when there's no photo) + name + role; opens the teacher's page. */
export function TeacherTile({ teacher, sizes }: { teacher: Teacher; sizes: string }) {
  return (
    <Link href={`/teachers/${teacher.id}`} className="group flex flex-col gap-2">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] bg-neutral-200">
        {teacher.avatar ? (
          <Image src={teacher.avatar} alt="" fill sizes={sizes} className="object-cover" />
        ) : (
          <UserRound aria-hidden className="size-1/2 fill-white text-white" strokeWidth={1} />
        )}
      </div>
      <div className="flex flex-col text-center">
        <span className="truncate text-base leading-6 font-medium underline-offset-2 group-hover:underline">
          {teacher.name}
        </span>
        {teacher.role && <span className="truncate text-sm leading-5 text-muted-foreground">{teacher.role}</span>}
      </div>
    </Link>
  )
}
