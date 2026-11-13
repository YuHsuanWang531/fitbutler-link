import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Link as LinkIcon, Smartphone } from "lucide-react"

import { ImageCarousel } from "@/components/member/image-carousel"
import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { getTeacher, getTeacherProfile, teachers } from "@/lib/member-teachers"
import type { SocialPlatform } from "@/lib/member-venues"
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

const SOCIAL_HOSTS: [SocialPlatform, RegExp][] = [
  ["instagram", /(^|\.)instagram\.com$/],
  ["facebook", /(^|\.)(facebook\.com|fb\.com)$/],
  ["line", /(^|\.)(line\.me|lin\.ee)$/],
  ["youtube", /(^|\.)(youtube\.com|youtu\.be)$/],
  ["threads", /(^|\.)threads\.(net|com)$/],
]

function socialPlatform(url: string): SocialPlatform | undefined {
  const host = URL.canParse(url) ? new URL(url).hostname : ""
  return SOCIAL_HOSTS.find(([, pattern]) => pattern.test(host))?.[0]
}

/** 老師介紹: opened from the 老師介紹 list and a booking card's teacher. */
export default async function TeacherPage({ params }: Props) {
  const teacher = getTeacher((await params).id)
  if (!teacher) notFound()
  const profile = getTeacherProfile(teacher)
  const teachesGroupClasses = teacher.role?.includes("團課") ?? false

  return (
    <>
      <MemberPageHeader title={teacher.name} />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <article className="flex flex-col gap-6 py-4 md:pt-3">
          {profile.photos.length > 0 && (
            <ImageCarousel
              images={profile.photos.map((src, i) => ({
                id: `${teacher.id}-${i}`,
                src,
                alt: `${teacher.name}的照片 ${i + 1}`,
              }))}
              label="切換至照片"
              trackClassName="px-[calc((100%-250px)/2)] md:px-[calc((100%-300px)/2)]"
              slideClassName="aspect-square w-[250px] md:w-[300px]"
              sizes="(max-width: 767px) 250px, 300px"
              priority
            />
          )}

          <div className="flex flex-col gap-4 px-4 lg:px-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl leading-8 font-medium">{teacher.name}</h1>
              {teacher.role && <p className="text-base leading-6 text-muted-foreground">{teacher.role}</p>}
            </div>
            {teachesGroupClasses && (
              <Link
                href={`/booking?teacher=${teacher.id}`}
                className="flex h-11 items-center justify-center rounded-[8px] bg-black text-base font-medium text-white hover:bg-neutral-800"
              >
                團課內容
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-6 px-4 lg:px-6">
            <section aria-labelledby="teacher-quote" className="flex flex-col gap-2">
              <h2 id="teacher-quote" className="text-lg leading-7 font-medium">
                教練的一句話
              </h2>
              <p className="text-base leading-6">{profile.quote}</p>
            </section>

            <section aria-labelledby="teacher-intro" className="flex flex-col gap-2">
              <h2 id="teacher-intro" className="text-lg leading-7 font-medium">
                教練介紹
              </h2>
              {/* Trusted back-office HTML; sanitize it here once it comes from the real API. */}
              <div className={RICH_TEXT} dangerouslySetInnerHTML={{ __html: profile.introHtml }} />
            </section>

            <section aria-labelledby="teacher-contact" className="flex flex-col gap-3">
              <h2 id="teacher-contact" className="text-lg leading-7 font-medium">
                聯絡資訊
              </h2>
              <p className="flex items-center gap-1.5 text-base leading-6">
                <Smartphone aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                {/* Phones can tap to call; tablets and computers just show the number. */}
                <a href={toTelHref(profile.phone)} className="underline underline-offset-2 md:hidden">
                  {profile.phone}
                </a>
                <span className="hidden md:inline">{profile.phone}</span>
              </p>
              {profile.links.length > 0 && (
                <ul className="flex flex-wrap items-center gap-3">
                  {profile.links.map((link) => {
                    const platform = socialPlatform(link.url)
                    return (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.title}
                          title={link.title}
                          className="flex size-6 items-center justify-center text-neutral-950"
                        >
                          {platform ? (
                            <Image src={`/images/${platform}.svg`} alt="" width={24} height={24} />
                          ) : (
                            <LinkIcon className="size-[22px]" strokeWidth={1.5} />
                          )}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </div>
        </article>
      </MemberMain>
    </>
  )
}
