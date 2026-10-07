"use client"

import Image from "next/image"

import { brands, useBrand } from "@/components/member/brand-context"

export function BrandLogoButton() {
  const { brand, cycleBrand } = useBrand()
  const next = brands[(brands.indexOf(brand) + 1) % brands.length]

  return (
    // Fixed 147×40 box so the header never changes size when switching brands;
    // each logo is scaled to fit inside it, keeping its own aspect ratio.
    <button
      type="button"
      onClick={cycleBrand}
      aria-label={`切換品牌至 ${next.name}`}
      className="relative h-10 w-[147px] shrink-0"
    >
      {/* Fill + contain scales every logo up to the box, not just down to it. */}
      <Image
        src={brand.logo}
        alt={brand.name}
        fill
        sizes="147px"
        priority
        className="object-contain object-left md:object-center"
      />
    </button>
  )
}
