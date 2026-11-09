import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"

/** Shared shell for flow pages that aren't designed yet (合約、付款、發票、登入). */
export function PlaceholderPage({
  title,
  fallbackHref,
  children,
}: {
  title: string
  fallbackHref?: string
  children?: React.ReactNode
}) {
  return (
    <>
      <MemberPageHeader title={title} fallbackHref={fallbackHref} />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
          <p className="rounded-[10px] bg-neutral-100 px-4 py-3 text-sm leading-5 text-neutral-600">
            此頁面尚在規劃中，以下為帶入的資料。
          </p>
          {children}
        </div>
      </MemberMain>
    </>
  )
}
