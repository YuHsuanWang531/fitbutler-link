import Image from "next/image"

import { NewsTag } from "@/components/member/news-tag"
import type { Course } from "@/lib/member-courses"

/** 課程介紹: a sideways-scrolling row of course photo + category tag + title. */
export function CourseCarousel({ courses }: { courses: Course[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-4 text-xl font-medium leading-7 text-black lg:px-6">課程介紹</h2>
      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:scroll-px-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
        {courses.map((course) => (
          <li key={course.id} className="flex w-[200px] shrink-0 snap-start flex-col gap-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-neutral-100">
              <Image src={course.image} alt="" fill sizes="200px" className="object-cover" />
            </div>
            <NewsTag>{course.category}</NewsTag>
            <p className="truncate text-base leading-6 font-medium">{course.title}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
