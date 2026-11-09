import Link from "next/link"
import { ChevronRight } from "lucide-react"

type EmptyFeatureBannerProps = { href: string; title: string; description: string; action: string }

/**
 * Stands in for a home section when the gym featured nothing in it: a brand-tinted banner that leads to the
 * full list. It replaces the section's heading and 看全部 too, which would only repeat it.
 */
export function EmptyFeatureBanner({ href, title, description, action }: EmptyFeatureBannerProps) {
  return (
    <div className="px-4 lg:px-6">
      <Link
        href={href}
        className="group flex flex-col items-start gap-3 rounded-[14px] bg-[color-mix(in_srgb,var(--brand-accent)_14%,white)] p-5"
      >
        <div className="flex flex-col gap-1">
          <p className="text-lg leading-7 font-medium text-black">{title}</p>
          <p className="text-sm leading-5 text-neutral-600">{description}</p>
        </div>
        <span className="flex h-9 items-center gap-1 rounded-full bg-(--brand-accent) pr-3 pl-4 text-sm font-medium text-(--brand-on-accent-text) group-hover:opacity-90">
          {action}
          <ChevronRight aria-hidden className="size-4" strokeWidth={2} />
        </span>
      </Link>
    </div>
  )
}
