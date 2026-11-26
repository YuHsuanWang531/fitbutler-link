"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellRing, ScanLine } from "lucide-react"

import { cn } from "@/lib/utils"
import { MemberNavIcon } from "@/components/member/member-nav-icon"
import { isNavItemActive, memberNavItems } from "@/components/member/member-nav-items"

const activeClassName = "bg-(--brand-tint) text-(--brand-on-tint)"
const itemClassName = "flex h-12 items-center gap-2 rounded-[10px] px-3 text-base leading-6 text-black"

// Figma's filled bell-ring (20×20), for the active 通知 item.
function BellRingFilled({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8.33292 15.8112C8.69665 15.6134 9.15207 15.7483 9.35009 16.1119C9.40618 16.215 9.48935 16.3017 9.59015 16.362C9.69089 16.4222 9.80633 16.4537 9.9237 16.4544C10.0413 16.4549 10.1576 16.4245 10.2591 16.3651C10.3605 16.3057 10.4444 16.2199 10.5014 16.1172C10.7028 15.7555 11.1595 15.6251 11.5214 15.826C11.883 16.0273 12.0134 16.4841 11.8125 16.846C11.6249 17.1834 11.3491 17.4647 11.0158 17.6596C10.6826 17.8545 10.3027 17.9561 9.91674 17.9544C9.53078 17.9525 9.15182 17.8474 8.82049 17.6495C8.48921 17.4514 8.21672 17.1675 8.0323 16.8284C7.83486 16.4647 7.96936 16.0091 8.33292 15.8112ZM9.99104 1.95355C11.3433 1.95983 12.6385 2.50314 13.5905 3.46344C14.5425 4.42403 15.074 5.72452 15.0679 7.07678C15.0567 9.50239 15.569 11.0097 16.0417 11.886C16.2789 12.3256 16.5108 12.6144 16.6713 12.7855C16.7514 12.8708 16.8143 12.9283 16.8521 12.9601C16.8676 12.9732 16.8797 12.9818 16.8862 12.9867L16.8852 12.9867L16.8832 12.9857L16.8823 12.9847L16.8813 12.9847C17.1552 13.1691 17.2769 13.5112 17.1801 13.8269C17.0829 14.1428 16.7894 14.3583 16.4589 14.3568L3.40826 14.2962C3.078 14.2944 2.78721 14.0762 2.69297 13.7596C2.61093 13.4827 2.69549 13.1863 2.90258 12.995L2.99374 12.9231L2.99178 12.9251C2.99709 12.9212 3.01014 12.9115 3.02902 12.8959C3.06707 12.8645 3.13046 12.8077 3.21147 12.723C3.37354 12.5534 3.60809 12.2669 3.84941 11.8294C4.33023 10.9576 4.85648 9.45511 4.8678 7.02942C4.8742 5.67715 5.41785 4.38166 6.37867 3.42995C7.33941 2.47861 8.63889 1.94742 9.99104 1.95355ZM3.57752 2.24115C3.81803 1.9044 4.28619 1.82623 4.62327 2.06632C4.96022 2.3068 5.03832 2.77491 4.7981 3.11206C3.99371 4.24023 3.47442 5.5403 3.46743 7.02292C3.46527 7.43693 3.12802 7.77135 2.71395 7.76943C2.29996 7.76742 1.96576 7.42991 1.96744 7.01595C1.97614 5.16469 2.63061 3.56915 3.57752 2.24115ZM15.3585 2.11617C15.6978 1.87906 16.1651 1.96174 16.4026 2.3007C17.3371 3.63744 17.9767 5.23898 17.9682 7.09025C17.9661 7.50422 17.6288 7.83863 17.2148 7.83676C16.8008 7.83475 16.4666 7.49724 16.4683 7.08329C16.475 5.60068 15.9678 4.29582 15.174 3.16024C14.937 2.82086 15.0193 2.35346 15.3585 2.11617Z" />
    </svg>
  )
}

export function MemberSideNav() {
  const pathname = usePathname()
  // 通知 / 進出場 have no page yet: clicking one makes it the active item (only one item is active, as in Figma)
  // until it's clicked again or the page changes.
  const [pickedAt, setPickedAt] = useState<{ item: "notify" | "scan"; path: string } | null>(null)
  const picked = pickedAt?.path === pathname ? pickedAt.item : null
  const pick = (item: "notify" | "scan") => setPickedAt(picked === item ? null : { item, path: pathname })

  return (
    // On desktop, sits 24px left of the centered 740px content card (150px nav + 24px gap), clamped to the viewport edge.
    <nav className="fixed inset-y-0 left-0 z-30 hidden lg:left-[max(0px,calc((100%-740px)/2-174px))] w-[134px] flex-col justify-center gap-1 px-3 py-6 md:flex lg:w-[150px] lg:px-4">
      {/* Active (picked): brand tint like the page links, and the bell swaps to Figma's filled one. */}
      <button
        type="button"
        aria-pressed={picked === "notify"}
        onClick={() => pick("notify")}
        className={cn(itemClassName, picked === "notify" ? activeClassName : "hover:bg-neutral-100")}
      >
        {picked === "notify" ? (
          <BellRingFilled className="size-5" />
        ) : (
          <BellRing size={20} strokeWidth={1.5} absoluteStrokeWidth />
        )}
        通知
      </button>
      {/* Replaces the floating 進出場條碼 button used on mobile. Figma has no filled scan-line, so only the tint changes. */}
      <button
        type="button"
        aria-label="進出場條碼"
        aria-pressed={picked === "scan"}
        onClick={() => pick("scan")}
        className={cn(itemClassName, picked === "scan" ? activeClassName : "hover:bg-neutral-100")}
      >
        <ScanLine size={20} strokeWidth={1.5} absoluteStrokeWidth />
        進出場
      </button>
      {memberNavItems.map(({ href, label, icon }) => {
        const active = !picked && isNavItemActive(href, pathname)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(itemClassName, active ? activeClassName : "hover:bg-neutral-100")}
          >
            <MemberNavIcon name={icon} active={active} className="size-5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
