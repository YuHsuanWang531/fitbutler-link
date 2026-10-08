import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { CalendarDays, MapPin } from "lucide-react"

import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { bookingApi } from "@/lib/booking/api"
import { CLASS_INFO_PAGE_ENABLED, getClassInfo } from "@/lib/booking/class-info"
import { classEndTime } from "@/lib/booking/classes"
import { formatDayTitle, fromKey } from "@/lib/booking/dates"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gymClass = await bookingApi.fetchClass((await params).id)
  return { title: gymClass ? `${gymClass.title}｜課程資訊` : "課程資訊" }
}

const metaRowClassName = "flex items-center gap-1.5 text-sm leading-5 text-muted-foreground"

export default async function ClassInfoPage({ params }: Props) {
  if (!CLASS_INFO_PAGE_ENABLED) notFound()
  const gymClass = await bookingApi.fetchClass((await params).id)
  if (!gymClass) notFound()
  const { intro, notes } = getClassInfo(gymClass.category)

  return (
    <>
      <MemberPageHeader title="課程資訊" fallbackHref="/booking" />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <article className="flex flex-col gap-6 px-4 py-4 md:pt-3 lg:px-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-5 text-muted-foreground">{gymClass.category}</p>
              <h1 className="text-2xl leading-8 font-medium">{gymClass.title}</h1>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className={metaRowClassName}>
                <CalendarDays aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                {formatDayTitle(fromKey(gymClass.date))} {gymClass.start}-{classEndTime(gymClass)}
              </p>
              <p className={metaRowClassName}>
                <MapPin aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                {gymClass.venue}｜{gymClass.room}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm leading-5">
              {gymClass.teacher.avatar ? (
                <Image
                  src={gymClass.teacher.avatar}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-full bg-neutral-200 text-xs text-neutral-700"
                >
                  {gymClass.teacher.name[0]}
                </span>
              )}
              <span className="font-medium">{gymClass.teacher.name}</span>
            </div>
          </div>

          <section aria-labelledby="class-intro" className="flex flex-col gap-2">
            <h2 id="class-intro" className="text-lg leading-7 font-medium">
              課程介紹
            </h2>
            {intro.map((paragraph) => (
              <p key={paragraph} className="text-base leading-6">
                {paragraph}
              </p>
            ))}
          </section>

          <section aria-labelledby="class-notes" className="flex flex-col gap-2">
            <h2 id="class-notes" className="text-lg leading-7 font-medium">
              注意事項
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-base leading-6 marker:text-neutral-400">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </article>
      </MemberMain>
    </>
  )
}
