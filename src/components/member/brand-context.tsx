"use client"

import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties } from "react"

import { getTabColors } from "@/lib/brand-colors"

export type Brand = {
  id: string
  name: string
  logo: { src: string; width: number; height: number }
  /** Highlight for the active nav item. */
  accent: string
}

export const brands: Brand[] = [
  {
    id: "den-yoga",
    name: "DEN YOGA",
    logo: { src: "/images/logo.png", width: 120, height: 33 },
    accent: "#000000",
  },
  {
    id: "sofit",
    name: "SoFit",
    logo: { src: "/images/logo-sofit.png", width: 120, height: 45 },
    accent: "#ebbe2a",
  },
  {
    id: "mountain-strong",
    name: "山·健身",
    logo: { src: "/images/logo-mountain.png", width: 416, height: 90 },
    accent: "#6c8966",
  },
  {
    id: "pilatique",
    name: "PILATIQUE",
    logo: { src: "/images/logo-pilatique.png", width: 400, height: 48 },
    accent: "#ccb69d",
  },
  {
    id: "gymneration",
    name: "健身時代",
    logo: { src: "/images/logo-gymneration.png", width: 777, height: 260 },
    accent: "#004290",
  },
]

type BrandContextValue = { brand: Brand; cycleBrand: () => void }

const BrandContext = createContext<BrandContextValue | null>(null)

/**
 * Provides the active brand and exposes its colors as CSS variables:
 * `--brand-accent`, plus `--brand-tint` / `--brand-on-tint` for the tab bar (contrast-adjusted).
 */
export function BrandProvider({ className, children }: { className?: string; children: React.ReactNode }) {
  const [index, setIndex] = useState(0)
  const cycleBrand = useCallback(() => setIndex((i) => (i + 1) % brands.length), [])
  const brand = brands[index]
  const { tint, onTint } = useMemo(() => getTabColors(brand.accent), [brand.accent])

  return (
    <BrandContext.Provider value={{ brand, cycleBrand }}>
      <div className={className} style={{ "--brand-accent": brand.accent, "--brand-tint": tint, "--brand-on-tint": onTint } as CSSProperties}>
        {children}
      </div>
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) throw new Error("useBrand must be used within BrandProvider")
  return context
}
