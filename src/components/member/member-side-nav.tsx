"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellRing, ScanLine } from "lucide-react"

import { cn } from "@/lib/utils"
import { MemberNavIcon } from "@/components/member/member-nav-icon"
import { isNavItemActive, memberNavItems } from "@/components/member/member-nav-items"

const itemClassName = "flex h-12 items-center gap-2 rounded-[10px] px-3 text-base leading-6 text-black"

export function MemberSideNav() {
  const pathname = usePathname()

  return (
    // On desktop, sits 24px left of the centered 680px content card (150px nav + 24px gap), clamped to the viewport edge.
    <nav className="fixed inset-y-0 left-0 z-20 hidden lg:left-[max(0px,calc((100%-680px)/2-174px))] w-[134px] flex-col justify-center gap-1 px-3 py-6 md:flex lg:w-[150px] lg:px-4">
      <button type="button" className={cn(itemClassName, "hover:bg-neutral-100")}>
        <BellRing className="size-[22px]" strokeWidth={1.5} />
        通知
      </button>
      {/* Replaces the floating 進出場條碼 button used on mobile. */}
      <button type="button" aria-label="進出場條碼" className={cn(itemClassName, "hover:bg-neutral-100")}>
        <ScanLine className="size-[22px]" strokeWidth={1.5} />
        進出場
      </button>
      {memberNavItems.map(({ href, label, icon }) => {
        const active = isNavItemActive(href, pathname)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(itemClassName, active ? "bg-(--brand-tint) text-(--brand-on-tint)" : "hover:bg-neutral-100")}
          >
            <MemberNavIcon name={icon} active={active} className="size-[22px]" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
