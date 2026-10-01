import { ScanLine } from "lucide-react"

import { NewsSection, type NewsItem } from "@/components/member/news-section"
import { PromoBannerCarousel, type PromoBanner } from "@/components/member/promo-banner-carousel"
import { VenueCarousel } from "@/components/member/venue-carousel"
import { newsArticles } from "@/lib/member-news"
import { venues } from "@/lib/member-venues"

// Mock content from the Figma design; replace with API data.
const banners: PromoBanner[] = Array.from({ length: 6 }, (_, i) =>
  i % 2 === 0
    ? { id: `banner-${i}`, image: "/images/banner-1.png", alt: "增肌冬令營 15 堂教練課｜60 天增肌挑戰" }
    : { id: `banner-${i}`, image: "/images/banner-2.png", alt: "中山旗艦館盛大開幕 開幕月入會首月 $0" }
)

const news: NewsItem[] = newsArticles.map((article) => {
  const [, month, day] = article.date.split("-")
  return {
    id: article.id,
    day,
    month: `${Number(month)} 月`,
    tag: article.tag,
    title: article.title,
    description: article.summary,
    image: article.thumbnail,
  }
})

export default function MemberHomePage() {
  return (
    <div className="flex flex-col gap-6 pt-3 pb-[88px] md:pb-6 lg:pt-6">
      <PromoBannerCarousel banners={banners} />
      <NewsSection items={news} />
      <VenueCarousel venues={venues} />

      <button
        type="button"
        className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-neutral-200 bg-white p-3 text-sm font-medium leading-5 text-black shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] md:hidden"
      >
        <ScanLine className="size-5 text-neutral-950" strokeWidth={1.5} />
        進出場條碼
      </button>
    </div>
  )
}
