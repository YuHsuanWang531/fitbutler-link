"use client"

import { useSyncExternalStore } from "react"

import { MOCK_MEMBER } from "@/lib/mock-member"
import type { SortKey } from "@/lib/shop-plans"

/**
 * The 購買 list's 場館. The picker lives in the tabs header (the pill next to 購買), the list in the page, so the two share it
 * through this small store. 場館 defaults to the member's 常去場館 when logged in, else 全部 (null).
 */
export type ShopFilters = { venue: string | null }

export const DEFAULT_SHOP_FILTERS: ShopFilters = {
  venue: MOCK_MEMBER.loggedIn ? MOCK_MEMBER.homeVenue : null,
}

let filters = DEFAULT_SHOP_FILTERS
const listeners = new Set<() => void>()

export function setShopFilters(next: ShopFilters) {
  filters = next
  listeners.forEach((listener) => listener())
}

export function useShopFilters() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => filters,
    () => DEFAULT_SHOP_FILTERS
  )
}

/** 排序 has its own header button (outside 篩選), starts unpicked and is kept across 方案類型 tabs. */
let sort: SortKey | null = null
const sortListeners = new Set<() => void>()

export function setShopSort(next: SortKey | null) {
  sort = next
  sortListeners.forEach((listener) => listener())
}

export function useShopSort() {
  return useSyncExternalStore(
    (listener) => {
      sortListeners.add(listener)
      return () => sortListeners.delete(listener)
    },
    () => sort,
    () => null
  )
}
