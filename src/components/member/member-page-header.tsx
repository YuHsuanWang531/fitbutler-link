"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

/** Sub-page header: back arrow + centered title. Sticky bar on mobile; from md up it sits above the content card, in place of the logo. */
export function MemberPageHeader({ title, fallbackHref = "/" }: { title: string; fallbackHref?: string }) {
  const router = useRouter()

  const goBack = () => {
    // Opened directly (e.g. a shared link) there is no in-app page to go back to.
    if (window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white pt-[env(safe-area-inset-top)] md:static md:mx-auto md:w-[500px] md:border-0 md:pt-6 md:pb-4 lg:mr-auto lg:ml-[max(174px,calc((100%-740px)/2))] lg:w-[740px]">
      {/* md: 40px row matches the logo header, so the card starts at the same height as on the tabs. */}
      <div className="flex h-15 items-center gap-2 px-4 md:h-10 lg:px-6">
        <button type="button" onClick={goBack} aria-label="返回" className="flex size-7 items-center justify-center">
          <ArrowLeft className="size-6" strokeWidth={1.5} />
        </button>
        <p className="flex-1 truncate text-center text-lg leading-[1.2] font-medium">{title}</p>
        <span aria-hidden className="size-7" />
      </div>
    </header>
  )
}
