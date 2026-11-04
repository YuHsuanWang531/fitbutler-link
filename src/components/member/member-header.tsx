"use client"

import { usePathname } from "next/navigation"
import { BellRing, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { BrandLogoButton } from "@/components/member/brand-logo-button"
import { VenueRules } from "@/components/booking/venue-rules"
import { requestOpenFilters, useActiveFilterCount } from "@/lib/booking/filter-bridge"

/**
 * Tabs header. Mobile: brand logo + 通知, except on 預約 where it's the page title + 篩選 + 場館使用規範.
 * md+: the brand logo centered above the content card, except on 預約 where the title row stays (aligned to the card).
 */
export function MemberHeader({ className }: { className?: string }) {
  const isBooking = usePathname() === "/booking"
  const filterCount = useActiveFilterCount()
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-[#e4e4e4] bg-white pt-[env(safe-area-inset-top)] md:static md:border-0 md:pt-6 md:pb-4",
        className
      )}
    >
      <div
        className={cn(
          "flex h-15 items-center justify-between px-6 md:h-auto md:justify-center",
          isBooking && "md:px-0"
        )}
      >
        {isBooking ? (
          // md+: the title row lines up with the content card below it (same width and offset as MemberMain).
          <div className="flex w-full items-center justify-between md:mx-auto md:w-[500px] md:px-7 lg:mr-auto lg:ml-[max(174px,calc((100%-740px)/2))] lg:w-[740px]">
            <h1 className="text-2xl leading-8 font-medium md:text-[28px] md:leading-9">預約</h1>
            <div className="flex items-center gap-5 text-neutral-950 md:gap-6">
              <button
                type="button"
                onClick={requestOpenFilters}
                aria-label={filterCount ? `篩選，已套用 ${filterCount} 個條件` : "篩選"}
                className="relative"
              >
                <SlidersHorizontal className="size-6 md:size-7" strokeWidth={1.5} />
                {filterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-black text-[10px] leading-none text-white">
                    {filterCount}
                  </span>
                )}
              </button>
              <VenueRules />
            </div>
          </div>
        ) : (
          <>
            <BrandLogoButton />
            <button type="button" aria-label="通知" className="text-neutral-950 md:hidden">
              <BellRing className="size-6" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
