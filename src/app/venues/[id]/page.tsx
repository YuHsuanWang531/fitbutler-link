import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowUpRight, Mail, MapPin, Smartphone } from "lucide-react"

import { ImageCarousel } from "@/components/member/image-carousel"
import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { VenueSocialLinks } from "@/components/member/venue-social-links"
import { getVenue, venues } from "@/lib/member-venues"
import { toTelHref } from "@/lib/phone"

type Props = { params: Promise<{ id: string }> }

// Only the known venues exist; any other id is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return venues.map((venue) => ({ id: venue.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const venue = getVenue((await params).id)
  return { title: venue ? `${venue.name}｜場館介紹` : "場館介紹" }
}

const contactRowClassName = "flex items-start gap-1.5 text-base leading-6"
const contactIconClassName = "mt-1 size-4 shrink-0 text-neutral-500"
const contactTextClassName = "min-w-0 break-words underline underline-offset-[3px]"

export default async function VenuePage({ params }: Props) {
  const venue = getVenue((await params).id)
  if (!venue) notFound()

  return (
    <>
      <MemberPageHeader title={venue.name} />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <div className="flex flex-col gap-6 py-4 md:pt-3">
          <ImageCarousel
            images={venue.gallery.map((image, i) => ({ id: `${venue.id}-${i}`, ...image }))}
            label="切換至圖片"
            trackClassName="px-4 md:px-[calc((100%-361px)/2)]"
            slideClassName="aspect-[361/240] max-w-[361px]"
            sizes="(max-width: 767px) 100vw, 361px"
            priority
          />

          <div className="flex flex-col gap-6 px-4 lg:px-6">
            <section className="flex flex-col gap-2">
              <h2 className="text-lg leading-7 font-medium">場館介紹</h2>
              <p className="text-lg leading-7 font-medium">{venue.lead}</p>
              <div className="flex flex-col gap-6">
                {venue.description.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {venue.hours.length > 0 && (
              <section className="flex flex-col gap-2">
                <h2 className="text-lg leading-7 font-medium">營業時間</h2>
                <ul className="flex flex-col gap-1.5 text-base leading-6">
                  {venue.hours.map((row) => (
                    <li key={row.day}>
                      {row.day} {row.time}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="flex flex-col gap-2">
              <h2 className="text-lg leading-7 font-medium">聯絡我們</h2>
              <address className="flex flex-col gap-1.5 not-italic">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactRowClassName}
                >
                  <MapPin aria-hidden className={contactIconClassName} strokeWidth={1.5} />
                  <span className={contactTextClassName}>{venue.address}</span>
                  <ArrowUpRight aria-hidden className="mt-1 size-4 shrink-0" strokeWidth={1.5} />
                  <span className="sr-only">（在 Google 地圖開啟）</span>
                </a>
                <a href={toTelHref(venue.phone)} className={contactRowClassName}>
                  <Smartphone aria-hidden className={contactIconClassName} strokeWidth={1.5} />
                  <span className={contactTextClassName}>{venue.phone}</span>
                </a>
                <a href={`mailto:${venue.email}`} className={contactRowClassName}>
                  <Mail aria-hidden className={contactIconClassName} strokeWidth={1.5} />
                  <span className={contactTextClassName}>{venue.email}</span>
                </a>
              </address>
            </section>

            {(venue.socials.length > 0 || venue.website) && (
              <VenueSocialLinks socials={venue.socials} website={venue.website} />
            )}
          </div>
        </div>
      </MemberMain>
    </>
  )
}
