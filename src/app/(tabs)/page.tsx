import { ScanLine } from "lucide-react"

import { NewsSection, type NewsItem } from "@/components/member/news-section"
import { PromoBannerCarousel, type PromoBanner } from "@/components/member/promo-banner-carousel"
import { VenueCarousel } from "@/components/member/venue-carousel"
import { newsArticles } from "@/lib/member-news"
import { venues } from "@/lib/member-venues"

// Mock content from the Figma design; replace with API data.
const banners: PromoBanner[] = [
  { id: "zhongshan-grand-opening", image: "/images/banner-2.png", alt: "中山旗艦館盛大開幕 開幕月入會首月 $0" },
  { id: "monthly-plan-888", image: "/images/banner-3.jpg", alt: "月費訂閱制免綁約，每月只要 $888" },
  { id: "small-group-class-450", image: "/images/banner-4.jpg", alt: "3 人就開班，小班精緻團課一堂只要 $450" },
  { id: "pt-zone-rules", image: "/images/banner-5.jpg", alt: "市府館 PT 專用區使用新制，10/10 起" },
  { id: "city-hall-equipment-upgrade", image: "/images/banner-6.jpg", alt: "市府館重訓區器材全面升級，8/7 重新開放" },
]

const news: NewsItem[] = newsArticles.map((article) => {
  const [, month, day] = article.date.split("-")
  return {
    id: article.id,
    day,
    month: `${Number(month)} 月`,
    tag: article.tag,
    title: article.title,
    // Article text runs long enough to fill the two-line teaser at every width.
    description: article.lead + article.body.join(""),
    image: article.thumbnail,
  }
})

export default function MemberHomePage() {
  return (
    <div className="flex flex-col gap-6 pt-3 pb-[88px] md:pb-6 lg:pt-6">
      <PromoBannerCarousel banners={banners} />
      <NewsSection items={news} />
      <VenueCarousel venues={venues} />

      {/* Floats 16px above the floating tab bar (8px gap + 82px bar) and from the right edge. */}
      <button
        type="button"
        aria-label="進出場條碼"
        className="fixed right-4 bottom-[calc(106px+env(safe-area-inset-bottom))] z-10 flex size-16 items-center justify-center rounded-full bg-(--brand-accent) text-(--brand-on-accent) shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] md:hidden"
      >
        <ScanLine className="size-6" strokeWidth={1.5} />
      </button>
    </div>
  )
}
