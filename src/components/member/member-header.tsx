"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellRing, FileText, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { BrandLogoButton } from "@/components/member/brand-logo-button"
import { requestOpenFilters, useActiveFilterCount } from "@/lib/booking/filter-bridge"

/**
 * Tabs header. Mobile: brand logo + 通知, except on 預約 where it's the page title + 篩選 + 預約規則.
 * md+: the brand logo centered above the content card on every tab.
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
      <div className="flex h-15 items-center justify-between px-6 md:h-auto md:justify-center">
        {isBooking ? (
          <>
            <h1 className="text-2xl leading-8 font-medium md:hidden">預約</h1>
            <div className="hidden md:block">
              <BrandLogoButton />
            </div>
            <div className="flex items-center gap-5 text-neutral-950 md:hidden">
              <button
                type="button"
                onClick={requestOpenFilters}
                aria-label={filterCount ? `篩選，已套用 ${filterCount} 個條件` : "篩選"}
                className="relative"
              >
                <SlidersHorizontal className="size-6" strokeWidth={1.5} />
                {filterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-black text-[10px] leading-none text-white">
                    {filterCount}
                  </span>
                )}
              </button>
              {/* 預約規則 page is still to be written; the link is in place for it. */}
              <Link href="/booking/rules" aria-label="預約規則">
                <FileText className="size-6" strokeWidth={1.5} />
              </Link>
            </div>
          </>
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
