"use client"

import Image from "next/image"
import Link from "next/link"

import { useBrand } from "@/components/member/brand-context"
import { EmptyFeatureBanner } from "@/components/member/empty-feature-banner"
import { NewsTag } from "@/components/member/news-tag"
import { SectionHeading } from "@/components/member/section-heading"
import { featuredCourses, type Course } from "@/lib/booking/courses"

/**
 * 課程介紹: a sideways-scrolling row of the featured courses, with 看全部 opening the full list.
 * With none featured, an `EmptyFeatureBanner` takes the whole section's place.
 */
export function CourseCarousel() {
  const { brand } = useBrand()
  const courses = brand.noFeaturedCourses ? [] : featuredCourses
  return (
    <section aria-label="課程介紹" className="flex flex-col gap-4">
      {courses.length > 0 ? (
        <>
          <SectionHeading title="課程介紹" allHref="/courses" />
          <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:scroll-px-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
            {courses.map((course) => (
              <li key={course.id} className="w-[200px] shrink-0 snap-start">
                <CourseTile course={course} sizes="200px" />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <EmptyFeatureBanner
          href="/courses"
          title="探索多元課程"
          description="找到你的運動節奏"
          action="看全部"
        />
      )}
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
