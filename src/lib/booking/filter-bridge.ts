"use client"

import { useSyncExternalStore } from "react"

/**
 * On phones the 篩選 button lives in the page header (tabs layout), outside the booking view. This bridge lets
 * the header show the applied-filter count and ask the booking view to open its filter panel.
 */
const OPEN_FILTERS_EVENT = "booking:open-filters"

let activeFilterCount = 0
const listeners = new Set<() => void>()

export function setActiveFilterCount(count: number) {
  if (count === activeFilterCount) return
  activeFilterCount = count
  listeners.forEach((listener) => listener())
}

export function useActiveFilterCount() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => activeFilterCount,
    () => 0
  )
}

export function requestOpenFilters() {
  window.dispatchEvent(new Event(OPEN_FILTERS_EVENT))
}

export function onOpenFiltersRequest(handler: () => void) {
  window.addEventListener(OPEN_FILTERS_EVENT, handler)
  return () => window.removeEventListener(OPEN_FILTERS_EVENT, handler)
}
