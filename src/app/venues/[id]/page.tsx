import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Mail, MapPin, Smartphone } from "lucide-react"

import { ImageCarousel } from "@/components/member/image-carousel"
import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { VenueSocialLinks } from "@/components/member/venue-social-links"
import { getVenue, venues } from "@/lib/member-venues"

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

/** "(+886)0912345678" → "+886912345678" (drop the domestic trunk 0 after the country code). */
function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "").replace(/^\+8860/, "+886")}`
}

const contactRowClassName = "flex items-center gap-0.5 text-sm leading-5 text-muted-foreground"

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
            slideClassName="aspect-[361/240] md:w-[361px]"
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

            <section className="flex flex-col gap-2">
              <h2 className="text-lg leading-7 font-medium">聯絡我們</h2>
              <address className="flex flex-col gap-2 not-italic">
                <p className={contactRowClassName}>
                  <MapPin className="size-3.5 shrink-0" />
                  {venue.address}
                </p>
                <a href={toTelHref(venue.phone)} className={contactRowClassName}>
                  <Smartphone className="size-3.5 shrink-0" />
                  {venue.phone}
                </a>
                <a href={`mailto:${venue.email}`} className={contactRowClassName}>
                  <Mail className="size-3.5 shrink-0" />
                  {venue.email}
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
