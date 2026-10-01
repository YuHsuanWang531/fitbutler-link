import type { MemberNavIconName } from "@/components/member/member-nav-icon"

export const memberNavItems: { href: string; label: string; icon: MemberNavIconName }[] = [
  { href: "/", label: "首頁", icon: "home" },
  { href: "/booking", label: "預約", icon: "booking" },
  { href: "/shop", label: "購買", icon: "shop" },
  { href: "/me", label: "我的", icon: "me" },
]

// Articles and venue pages are opened from the home page, so they keep 首頁 highlighted.
export function isNavItemActive(href: string, pathname: string) {
  if (href === "/") return pathname === href || /^\/(news|venues)\//.test(pathname)
  return pathname.startsWith(href)
}
