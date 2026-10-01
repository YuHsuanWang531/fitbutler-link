import { ImageCarousel } from "@/components/member/image-carousel"

export type PromoBanner = { id: string; image: string; alt: string }

export function PromoBannerCarousel({ banners }: { banners: PromoBanner[] }) {
  return (
    <ImageCarousel
      images={banners.map(({ id, image, alt }) => ({ id, src: image, alt }))}
      label="切換至橫幅"
      trackClassName="px-4 md:px-[calc((100%-361px)/2)] lg:scroll-px-6 lg:px-6"
      slideClassName="aspect-[361/203] md:w-[361px] lg:snap-start"
      sizes="(max-width: 767px) 100vw, 361px"
      priority
    />
  )
}
