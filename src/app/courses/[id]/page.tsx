import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock } from "lucide-react"

import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { NewsTag } from "@/components/member/news-tag"
import { courses, getCourse } from "@/lib/booking/courses"

type Props = { params: Promise<{ id: string }> }

// Only catalog courses exist; any other id is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).id)
  return { title: course ? `${course.title}｜課程資訊` : "課程資訊" }
}

/** 課程資訊: opened from the home page's 課程介紹 and from a booking card's 課程資訊 button. */
export default async function CoursePage({ params }: Props) {
  const course = getCourse((await params).id)
  if (!course) notFound()

  return (
    <>
      <MemberPageHeader title="課程資訊" />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <article className="flex flex-col gap-6 py-4 md:pt-3">
          <div className="px-4 lg:px-6">
            <div className="relative aspect-[361/240] overflow-hidden rounded-[10px] bg-neutral-100">
              <Image
                src={course.image}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 692px"
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <NewsTag>{course.category}</NewsTag>
              <h1 className="text-2xl leading-8 font-medium">{course.title}</h1>
              <p className="flex items-center gap-1.5 text-sm leading-5 text-muted-foreground">
                <Clock aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                {course.durationMin} 分鐘
              </p>
            </div>

            <Link
              href={`/booking?course=${course.id}`}
              className="flex h-11 items-center justify-center rounded-[8px] bg-black text-base font-medium text-white hover:bg-neutral-800"
            >
              預約
            </Link>

            <section aria-labelledby="course-intro" className="flex flex-col gap-2">
              <h2 id="course-intro" className="text-lg leading-7 font-medium">
                課程介紹
              </h2>
              {course.intro.map((paragraph) => (
                <p key={paragraph} className="text-base leading-6">
                  {paragraph}
                </p>
              ))}
            </section>
          </div>
        </article>
      </MemberMain>
    </>
  )
}
