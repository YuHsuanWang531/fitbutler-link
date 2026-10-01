import { MemberHeader } from "@/components/member/member-header"
import { MemberMain } from "@/components/member/member-main"
import { MemberTabBar } from "@/components/member/member-tab-bar"

/** Top-level tabs: brand header + bottom tab bar on mobile. */
export default function MemberTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MemberHeader />
      <MemberMain className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</MemberMain>
      <MemberTabBar />
    </>
  )
}
