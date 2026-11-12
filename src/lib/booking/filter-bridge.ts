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

/**
 * 場館 moved out of 篩選 into a pill next to the 預約 title (also in the header): the booking view publishes its
 * venue list and picked venue here, and the pill asks it to switch.
 */
const SET_VENUE_EVENT = "booking:set-venue"

let venueState: { venues: string[]; venue: string | null } = { venues: [], venue: null }
const venueListeners = new Set<() => void>()

export function setBookingVenueState(venues: string[], venue: string | null) {
  if (venues === venueState.venues && venue === venueState.venue) return
  venueState = { venues, venue }
  venueListeners.forEach((listener) => listener())
}

const EMPTY_VENUE_STATE = { venues: [] as string[], venue: null as string | null }

export function useBookingVenueState() {
  return useSyncExternalStore(
    (listener) => {
      venueListeners.add(listener)
      return () => venueListeners.delete(listener)
    },
    () => venueState,
    () => EMPTY_VENUE_STATE
  )
}

export function requestSetVenue(venue: string | null) {
  window.dispatchEvent(new CustomEvent<string | null>(SET_VENUE_EVENT, { detail: venue }))
}

export function onSetVenueRequest(handler: (venue: string | null) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string | null>).detail)
  window.addEventListener(SET_VENUE_EVENT, listener)
  return () => window.removeEventListener(SET_VENUE_EVENT, listener)
}
