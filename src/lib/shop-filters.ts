"use client"

import { useSyncExternalStore } from "react"

import { MOCK_MEMBER } from "@/lib/mock-member"
import type { SortKey } from "@/lib/shop-plans"

/**
 * The 購買 list's 場館 + 排序. The picker lives in the tabs header (篩選), the list in the page, so the two share
 * them through this small store. 場館 defaults to the member's 常去場館 when logged in, else 全部 (null).
 */
export type ShopFilters = { venue: string | null; sort: SortKey }

export const DEFAULT_SHOP_FILTERS: ShopFilters = {
  venue: MOCK_MEMBER.loggedIn ? MOCK_MEMBER.homeVenue : null,
  sort: "newest",
}
/** What 清除 resets to: 全部 venues, 最新上架. */
export const CLEARED_SHOP_FILTERS: ShopFilters = { venue: null, sort: "newest" }

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

export const countShopFilters = (f: ShopFilters) => Number(f.venue !== null) + Number(f.sort !== "newest")
