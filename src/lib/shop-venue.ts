"use client"

import { useSyncExternalStore } from "react"

/**
 * The 購買 tab's venue filter (empty = 全部). The picker lives in the tabs header (篩選), the plan list in the
 * page, so the two share it through this small store. Resets on reload.
 */
let venues: string[] = []
const listeners = new Set<() => void>()
const EMPTY: string[] = []

export function setShopVenues(next: string[]) {
  venues = next
  listeners.forEach((listener) => listener())
}

export function useShopVenues() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => venues,
    () => EMPTY
  )
}
