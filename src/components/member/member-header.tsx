import { BellRing } from "lucide-react"

import { cn } from "@/lib/utils"
import { BrandLogoButton } from "@/components/member/brand-logo-button"

export function MemberHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-[#e4e4e4] bg-white pt-[env(safe-area-inset-top)] md:static md:border-0 md:pt-6 md:pb-4",
        className
      )}
    >
      <div className="flex h-15 items-center justify-between px-6 md:h-auto md:justify-center">
        <BrandLogoButton />
        <button type="button" aria-label="通知" className="text-neutral-950 md:hidden">
          <BellRing className="size-6" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
