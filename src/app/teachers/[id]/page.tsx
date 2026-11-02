import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Phone } from "lucide-react"

import { ImageCarousel } from "@/components/member/image-carousel"
import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { getTeacher, getTeacherProfile, teachers } from "@/lib/member-teachers"
import { toTelHref } from "@/lib/phone"

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

/** Rich text from the back office editor: paragraphs, bold, lists and links. */
const RICH_TEXT =
  "flex flex-col gap-3 text-base leading-6 [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1 [&_ul]:pl-5 [&_ul]:marker:text-neutral-400"

/** 老師介紹: opened from the home page's 老師介紹 and from a booking card's teacher. */
export default async function TeacherPage({ params }: Props) {
  const teacher = getTeacher((await params).id)
  if (!teacher) notFound()
  const profile = getTeacherProfile(teacher)

  return (
    <>
      <MemberPageHeader title="老師介紹" />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <article className="flex flex-col gap-6 py-4 md:pt-3">
          <div className="flex flex-col items-center gap-3 px-4 text-center lg:px-6">
            <div className="relative size-28 overflow-hidden rounded-full bg-neutral-100">
              {teacher.avatar && (
                <Image src={teacher.avatar} alt="" fill sizes="112px" priority className="object-cover" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl leading-8 font-medium">{teacher.name}</h1>
              {teacher.role && <p className="text-sm leading-5 text-muted-foreground">{teacher.role}</p>}
            </div>
            <blockquote className="w-full rounded-[10px] bg-neutral-50 px-4 py-3 text-base leading-6">
              「{profile.quote}」
            </blockquote>
          </div>

          <div className="flex flex-col gap-6 px-4 lg:px-6">
            <section aria-labelledby="teacher-intro" className="flex flex-col gap-2">
              <h2 id="teacher-intro" className="text-lg leading-7 font-medium">
                自我介紹
              </h2>
              {/* Trusted back-office HTML; sanitize it here once it comes from the real API. */}
              <div className={RICH_TEXT} dangerouslySetInnerHTML={{ __html: profile.introHtml }} />
            </section>

            <section aria-labelledby="teacher-contact" className="flex flex-col gap-2">
              <h2 id="teacher-contact" className="text-lg leading-7 font-medium">
                聯絡電話
              </h2>
              {/* Phones get a call button; tablets and computers just show the number. */}
              <a
                href={toTelHref(profile.phone)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-300 text-sm font-medium hover:bg-neutral-100 md:hidden"
              >
                <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                撥打電話
              </a>
              <p className="hidden items-center gap-1.5 text-base leading-6 md:flex">
                <Phone aria-hidden className="size-4 text-muted-foreground" strokeWidth={1.5} />
                {profile.phone}
              </p>
            </section>

            {profile.links.length > 0 && (
              <nav aria-labelledby="teacher-links" className="flex flex-col gap-2">
                <h2 id="teacher-links" className="text-lg leading-7 font-medium">
                  相關連結
                </h2>
                <ul className="flex flex-col gap-2">
                  {profile.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base leading-6 underline underline-offset-2"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          {profile.photos.length > 0 && (
            <section aria-labelledby="teacher-photos" className="flex flex-col gap-2">
              <h2 id="teacher-photos" className="px-4 text-lg leading-7 font-medium lg:px-6">
                照片
              </h2>
              <ImageCarousel
                images={profile.photos.map((src, i) => ({
                  id: `${teacher.id}-${i}`,
                  src,
                  alt: `${teacher.name}的照片 ${i + 1}`,
                }))}
                label="切換至照片"
                trackClassName="px-4 md:px-[calc((100%-300px)/2)]"
                slideClassName="aspect-square md:w-[300px]"
                sizes="(max-width: 767px) 100vw, 300px"
              />
            </section>
          )}
        </article>
      </MemberMain>
    </>
  )
}
