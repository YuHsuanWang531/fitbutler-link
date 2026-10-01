"use client"

import Image from "next/image"

import { useSnapCarousel } from "@/hooks/use-snap-carousel"
import { cn } from "@/lib/utils"
import { CarouselDots } from "@/components/member/carousel-dots"

export type CarouselImage = { id: string; src: string; alt: string }

// Enough clones on each side to fill the peeking edges at every breakpoint.
const LOOP_CLONES = 2

type ImageCarouselProps = {
  images: CarouselImage[]
  /** Dot button label prefix, e.g. "切換至橫幅". */
  label: string
  /** Side padding of the scroll track; decides how much of the neighbours peeks in. */
  trackClassName?: string
  /** Size/aspect of each slide; slides snap to center unless overridden. */
  slideClassName?: string
  sizes: string
  priority?: boolean
}

/** Endless, swipeable image carousel with dot indicators. */
export function ImageCarousel({
  images,
  label,
  trackClassName,
  slideClassName,
  sizes,
  priority,
}: ImageCarouselProps) {
  const clones = images.length > 1 ? Math.min(LOOP_CLONES, images.length) : 0
  const { ref, index, scrollTo, ready } = useSnapCarousel<HTMLDivElement>({ loopClones: clones })

  const slides = [
    ...images.slice(images.length - clones).map((img) => ({ ...img, key: `before-${img.id}`, clone: true, leading: true })),
    ...images.map((img) => ({ ...img, key: img.id, clone: false, leading: false })),
    ...images.slice(0, clones).map((img) => ({ ...img, key: `after-${img.id}`, clone: true, leading: false })),
  ]

  return (
    <section className="flex flex-col gap-4">
      <div
        ref={ref}
        className={cn(
          "relative flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          trackClassName
        )}
      >
        {slides.map((slide) => (
          <div
            key={slide.key}
            aria-hidden={slide.clone || undefined}
            className={cn(
              "relative w-full shrink-0 snap-center overflow-hidden rounded-[10px]",
              slideClassName,
              // Leading clones would push the first real slide off-screen before the carousel is live.
              slide.leading && !ready && "hidden"
            )}
          >
            <Image
              src={slide.src}
              alt={slide.clone ? "" : slide.alt}
              fill
              sizes={sizes}
              priority={priority && slide.key === images[0]?.id}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <CarouselDots count={images.length} active={index} onSelect={scrollTo} label={label} />
      )}
    </section>
  )
}
