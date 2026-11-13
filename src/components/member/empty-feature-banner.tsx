import Link from "next/link"

type EmptyFeatureBannerProps = { href: string; title: string; description: string; action: string }

/**
 * Stands in for a home section when the gym featured nothing in it: a neutral banner that leads to the full list.
 * It replaces the section's heading and 看全部 too, which would only repeat it.
 */
export function EmptyFeatureBanner({ href, title, description, action }: EmptyFeatureBannerProps) {
  return (
    <div className="px-4 lg:px-6">
      <Link href={href} className="group flex items-center gap-4 rounded-[10px] bg-neutral-100 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-lg leading-7 font-medium text-black">{title}</p>
          <p className="text-sm leading-5 text-neutral-500">{description}</p>
        </div>
        <span className="flex h-9 shrink-0 items-center rounded-[8px] border border-neutral-200 bg-white px-4 text-sm text-black group-hover:bg-neutral-50">
          {action}
        </span>
      </Link>
    </div>
  )
}
