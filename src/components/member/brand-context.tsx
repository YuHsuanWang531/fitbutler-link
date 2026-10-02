"use client"

import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties } from "react"

import { getOnAccent, getTabColors } from "@/lib/brand-colors"

export type Brand = {
  id: string
  name: string
  /** Image path; scaled to fit the header logo box. */
  logo: string
  /** Highlight for the active nav item. */
  accent: string
  /** Text on a solid accent fill; defaults to whichever of black/white contrasts more. */
  onAccent?: string
}

export const brands: Brand[] = [
  {
    id: "den-yoga",
    name: "DEN YOGA",
    logo: "/images/logo.png",
    accent: "#000000",
  },
  {
    id: "sofit",
    name: "SoFit",
    logo: "/images/logo-sofit.png",
    accent: "#ebbe2b",
  },
  {
    id: "mountain-strong",
    name: "山·健身",
    logo: "/images/logo-mountain.png",
    accent: "#6c8966",
    onAccent: "#ffffff",
  },
  {
    id: "pilatique",
    name: "PILATIQUE",
    logo: "/images/logo-pilatique.png",
    accent: "#c6ae9b",
  },
  {
    id: "gymneration",
    name: "健身時代",
    logo: "/images/logo-gymneration.png",
    accent: "#004290",
  },
]

type BrandContextValue = { brand: Brand; cycleBrand: () => void }

const BrandContext = createContext<BrandContextValue | null>(null)

/**
 * Provides the active brand and exposes its colors as CSS variables:
 * `--brand-accent` with `--brand-on-accent` (black or white text on it),
 * plus `--brand-tint` / `--brand-on-tint` for the tab bar (contrast-adjusted).
 */
export function BrandProvider({ className, children }: { className?: string; children: React.ReactNode }) {
  const [index, setIndex] = useState(0)
  const cycleBrand = useCallback(() => setIndex((i) => (i + 1) % brands.length), [])
  const brand = brands[index]
  const { tint, onTint } = useMemo(() => getTabColors(brand.accent), [brand.accent])
  const onAccent = brand.onAccent ?? getOnAccent(brand.accent)

  return (
    <BrandContext.Provider value={{ brand, cycleBrand }}>
      <div className={className} style={
          {
            "--brand-accent": brand.accent,
            "--brand-on-accent": onAccent,
            "--brand-tint": tint,
            "--brand-on-tint": onTint,
          } as CSSProperties
        }>
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
