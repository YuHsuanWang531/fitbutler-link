"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"
import { MemberMainContext } from "@/components/member/scroll-container"

/**
 * Page body. Mobile: flush, the window scrolls.
 * md+: a centered card under the header, at least as tall as the screen allows, its outline pinned on screen. The window scrolls (so the
 * wheel works over the card and the space beside it, and the scrollbar is at the window edge); the header sticks.
 * lg: stays centered but keeps 24px clear of the 150px side nav on narrow desktops.
 */
export function MemberMain({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  return (
    <main
      ref={ref}
      className={cn(
        "flex-1 md:mx-auto md:mb-6 md:w-[500px] lg:mr-auto lg:ml-[max(174px,calc((100%-740px)/2))] lg:w-[740px]",
        className
      )}
    >
      {/* md+: the card's outline, pinned between the header and 24px above the screen bottom while the page scrolls
          (so it never scrolls away). It takes no space; its white outer shadow hides whatever scrolls outside it. */}
      <div
        aria-hidden
        className="pointer-events-none sticky top-(--header-h) z-[25] -mb-[calc(100dvh-var(--header-h)-24px)] hidden h-[calc(100dvh-var(--header-h)-24px)] rounded-[10px] border border-neutral-200 shadow-[0_0_0_100vmax_white] md:block"
      />
      <MemberMainContext.Provider value={ref}>{children}</MemberMainContext.Provider>
    </main>
  )
}
