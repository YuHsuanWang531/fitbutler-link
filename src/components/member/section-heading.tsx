import Link from "next/link"

/** A home section's title, with an optional 看全部 link to its full list on the right. */
export function SectionHeading({ title, allHref }: { title: string; allHref?: string }) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <h2 className="text-xl font-medium leading-7 text-black">{title}</h2>
      {allHref && (
        <Link href={allHref} className="text-sm leading-5 font-medium underline-offset-2 hover:underline">
          看全部
        </Link>
      )}
    </div>
  )
}
