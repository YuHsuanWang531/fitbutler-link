"use client"

import Image from "next/image"

import { brands, useBrand } from "@/components/member/brand-context"

export function BrandLogoButton() {
  const { brand, cycleBrand } = useBrand()
  const next = brands[(brands.indexOf(brand) + 1) % brands.length]

  return (
    // Fixed 110×30 box so the header never changes size when switching brands;
    // each logo is scaled to fit inside it, keeping its own aspect ratio.
    <button
      type="button"
      onClick={cycleBrand}
      aria-label={`切換品牌至 ${next.name}`}
      className="flex h-[30px] w-[110px] shrink-0 items-center justify-start md:justify-center"
    >
      <Image
        src={brand.logo.src}
        alt={brand.name}
        width={brand.logo.width}
        height={brand.logo.height}
        priority
        className="h-auto max-h-full w-auto max-w-full"
      />
    </button>
  )
}
