import Image from "next/image"
import Link from "next/link"

import type { Teacher } from "@/lib/booking/types"

/** 老師介紹: a sideways-scrolling row of portrait + name; each opens the teacher's page (not built yet). */
export function TeacherCarousel({ teachers }: { teachers: Teacher[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-4 text-xl font-medium leading-7 text-black lg:px-6">老師介紹</h2>
      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:scroll-px-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
        {teachers.map((teacher) => (
          <li key={teacher.id} className="w-[150px] shrink-0 snap-start">
            <Link href={`/teachers/${teacher.id}`} className="group flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-[10px] bg-neutral-100">
                {teacher.avatar && (
                  <Image src={teacher.avatar} alt="" fill sizes="150px" className="object-cover" />
                )}
              </div>
              <span className="truncate text-center text-base leading-6 font-medium underline-offset-2 group-hover:underline">
                {teacher.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
