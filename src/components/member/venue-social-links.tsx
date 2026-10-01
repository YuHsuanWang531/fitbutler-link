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

type VenueSocialLinksProps = Pick<Venue, "socials" | "website"> & { className?: string }

export function VenueSocialLinks({ socials, website, className }: VenueSocialLinksProps) {
  return (
    <div className={cn("flex h-6 items-center gap-2", className)}>
      {socials.map(({ platform, url }) => (
        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[platform]}>
          <Image src={`/images/${platform}.svg`} alt="" width={24} height={24} />
        </a>
      ))}
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer" aria-label="官方網站" className="text-neutral-950">
          <LinkIcon className="size-5" strokeWidth={1.5} />
        </a>
      )}
    </div>
  )
}
