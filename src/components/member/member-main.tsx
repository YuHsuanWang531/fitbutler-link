"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

/**
 * Page body. Mobile: flush, the window scrolls.
 * md+: a fixed, centered bordered card filling the space under the header; only its content scrolls.
 */
export function MemberMain({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()

  // The card persists across tab pages, so start each page at the top (no-op on mobile, where it doesn't scroll).
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <main
      ref={ref}
      className={cn(
        "flex-1 md:mx-auto md:mb-6 md:min-h-0 md:w-[500px] md:overflow-x-hidden md:overflow-y-auto md:overscroll-contain md:rounded-[14px] md:border md:border-neutral-200 lg:w-[680px]",
        className
      )}
    >
      {children}
    </main>
  )
}
