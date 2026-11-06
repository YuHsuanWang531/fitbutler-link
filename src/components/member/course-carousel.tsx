import Image from "next/image"
import Link from "next/link"

import { NewsTag } from "@/components/member/news-tag"
import { SectionHeading } from "@/components/member/section-heading"
import type { Course } from "@/lib/booking/courses"

/** 課程介紹: a sideways-scrolling row of featured courses, with 看全部 opening the full list. */
export function CourseCarousel({ courses }: { courses: Course[] }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading title="課程介紹" allHref="/courses" />
      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:scroll-px-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
        {courses.map((course) => (
          <li key={course.id} className="w-[200px] shrink-0 snap-start">
            <CourseTile course={course} sizes="200px" />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Course photo + category tag + title; opens its 課程資訊 page. */
export function CourseTile({ course, sizes }: { course: Course; sizes: string }) {
  return (
    <Link href={`/courses/${course.id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-neutral-100">
        <Image src={course.image} alt="" fill sizes={sizes} className="object-cover" />
      </div>
      <NewsTag>{course.category}</NewsTag>
      <p className="truncate text-base leading-6 font-medium underline-offset-2 group-hover:underline">
        {course.title}
      </p>
    </Link>
  )
}
