// TEMP: lets the 購買 list switch between the two 價格位置 so they can be compared; remove once one is picked.

import { useSyncExternalStore } from "react"

export type PriceLayout = "below" | "right"

let layout: PriceLayout = "below"
const listeners = new Set<() => void>()

export function setPriceLayout(next: PriceLayout) {
  layout = next
  listeners.forEach((l) => l())
}

export function usePriceLayout() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => layout,
    () => "below" as const
  )
}
