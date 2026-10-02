"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { MemberNavIcon } from "@/components/member/member-nav-icon"
import { isNavItemActive, memberNavItems } from "@/components/member/member-nav-items"

// Floating pill bar: 16px from the screen sides, 8px from the bottom (plus the home-indicator inset).
export function MemberTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-4 bottom-[calc(8px+env(safe-area-inset-bottom))] z-20 rounded-full border border-[#e4e4e4] bg-white shadow-[0_4px_16px_-2px_rgb(0_0_0/0.12)] md:hidden">
      <ul className="flex h-[66px]">
        {memberNavItems.map(({ href, label, icon }) => {
          const active = isNavItemActive(href, pathname)
          return (
            <li key={href} className="flex-1 px-1 py-[3px]">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="group flex h-full items-center justify-center font-sans text-xs leading-[18px] outline-none"
              >
                <span
                  className={cn(
                    // Fills its slot, 4px inside the 68px bar's border.
                    "flex h-15 w-full flex-col items-center justify-center gap-0.5 rounded-full group-focus-visible:ring-2 group-focus-visible:ring-ring/50",
                    active ? "bg-(--brand-tint) text-(--brand-on-tint)" : "text-[#a3a3a3]"
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
