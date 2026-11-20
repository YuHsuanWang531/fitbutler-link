import { MemberHeader } from "@/components/member/member-header"
import { MemberMain } from "@/components/member/member-main"
import { MemberTabBar } from "@/components/member/member-tab-bar"

/** Top-level tabs: brand header + bottom tab bar on mobile. */
export default function MemberTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MemberHeader />
      <MemberMain className="pb-[calc(68px+max(8px,calc(env(safe-area-inset-bottom)_-_16px)))] md:pb-0">{children}</MemberMain>
      <MemberTabBar />
    </>
  )
}
