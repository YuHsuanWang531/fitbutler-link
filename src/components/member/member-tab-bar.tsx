"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { MemberNavIcon } from "@/components/member/member-nav-icon"
import { isNavItemActive, memberNavItems } from "@/components/member/member-nav-items"

// Floating pill bar: 16px from the screen sides, 8px from the bottom, or on phones with a home indicator
// 16px into its inset, just above the indicator line. The tabs pages' padding, the home FAB and the toast follow it.
export function MemberTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-4 bottom-[max(8px,calc(env(safe-area-inset-bottom)_-_16px))] z-20 rounded-full border border-neutral-200 bg-white md:hidden">
      <ul className="flex p-1.5">
        {memberNavItems.map(({ href, label, icon }) => {
          const active = isNavItemActive(href, pathname)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="group flex h-full items-center justify-center font-sans text-xs leading-[18px] outline-none"
              >
                <span
                  className={cn(
                    // Figma: 6px 28px around a 24px icon over its 12px label; the bar is 6px around it (68px tall).
                    "flex w-full flex-col items-center justify-center rounded-full px-7 py-1.5 group-focus-visible:ring-2 group-focus-visible:ring-ring/50",
                    active ? "bg-(--brand-tint) text-(--brand-on-tint)" : "text-muted-foreground"
                  )}
                >
                  <MemberNavIcon name={icon} active={active} className="size-6" />
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
