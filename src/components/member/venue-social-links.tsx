import Image from "next/image"
import { Link as LinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { SocialPlatform, Venue } from "@/lib/member-venues"

const socialLabels: Record<SocialPlatform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  line: "LINE",
  threads: "Threads",
}

type VenueSocialLinksProps = Pick<Venue, "socials" | "website"> & {
  /** "lg" = 28px icons, used on the home venue cards. */
  size?: "md" | "lg"
  className?: string
}

export function VenueSocialLinks({ socials, website, size = "md", className }: VenueSocialLinksProps) {
  const iconSize = size === "lg" ? 28 : 24
  return (
    <div className={cn("flex items-center gap-2", size === "lg" ? "h-7" : "h-6", className)}>
      {socials.map(({ platform, url }) => (
        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[platform]}>
          <Image src={`/images/${platform}.svg`} alt="" width={iconSize} height={iconSize} />
        </a>
      ))}
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer" aria-label="官方網站" className="text-neutral-950">
          <LinkIcon className={size === "lg" ? "size-[22px]" : "size-5"} strokeWidth={1.5} />
        </a>
      )}
    </div>
  )
}
