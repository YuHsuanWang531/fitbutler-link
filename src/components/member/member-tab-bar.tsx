"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { MemberNavIcon } from "@/components/member/member-nav-icon"
import { isNavItemActive, memberNavItems } from "@/components/member/member-nav-items"

export function MemberTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e4e4e4] bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="flex h-20">
        {memberNavItems.map(({ href, label, icon }) => {
          const active = isNavItemActive(href, pathname)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex h-full items-center justify-center font-sans text-xs leading-[18px]"
              >
                <span
                  className={cn(
                    "flex h-15 w-17 flex-col items-center justify-center gap-0.5 rounded-2xl",
                    active ? "bg-(--brand-tint) text-(--brand-on-tint)" : "text-[#bebebe]"
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
