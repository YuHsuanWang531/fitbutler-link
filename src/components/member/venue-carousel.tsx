"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

import { useSnapCarousel } from "@/hooks/use-snap-carousel"
import type { Venue } from "@/lib/member-venues"
import { CarouselDots } from "@/components/member/carousel-dots"
import { VenueSocialLinks } from "@/components/member/venue-social-links"

export function VenueCarousel({ venues }: { venues: Venue[] }) {
  const { ref, index, scrollTo } = useSnapCarousel<HTMLDivElement>()

  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-4 text-xl lg:px-6 font-medium leading-7 text-black">場館一覽</h2>
      <div className="flex flex-col gap-4">
        <div
          ref={ref}
          className="relative flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 lg:scroll-px-6 lg:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="relative flex w-[257px] shrink-0 snap-start flex-col overflow-hidden rounded-[10px] border border-neutral-200"
            >
              <div className="relative h-[170px]">
                <Image src={venue.image} alt={venue.name} fill sizes="257px" className="object-cover" />
              </div>
              <div className="flex flex-col gap-3 p-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-base font-medium leading-6 text-black">
                    {/* Stretched link: the whole card opens the venue page, social icons stay clickable above it. */}
                    <Link href={`/venues/${venue.id}`} className="after:absolute after:inset-0">
                      {venue.name}
                    </Link>
                  </h3>
                  <p className="flex items-center gap-1 text-sm leading-5 text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate">{venue.address}</span>
                  </p>
                </div>
                <VenueSocialLinks socials={venue.socials} website={venue.website} className="relative z-10 w-fit" />
              </div>
            </article>
          ))}
        </div>
        <CarouselDots
          count={venues.length}
          active={index}
          onSelect={scrollTo}
          inactiveClassName="bg-[#bebebe]"
          label="切換至場館"
        />
      </div>
    </section>
  )
}
