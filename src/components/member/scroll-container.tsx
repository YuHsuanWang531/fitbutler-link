"use client"

import { createContext, useCallback, useContext, type RefObject } from "react"

/** The `<main>` card. It is the scroll container from md up; below md the window scrolls. */
export const MemberMainContext = createContext<RefObject<HTMLElement | null> | null>(null)

export type ScrollTarget = {
  /** `null` when the window scrolls. */
  el: HTMLElement | null
  scrollTop: number
  /** Top of the visible scroll area, in viewport coordinates. */
  viewportTop: number
  viewportHeight: number
  scrollTo(top: number, behavior: ScrollBehavior): void
}

/** Returns a function that resolves whichever element is scrolling right now. */
export function useScrollTarget() {
  const mainRef = useContext(MemberMainContext)

  return useCallback((): ScrollTarget => {
    const main = mainRef?.current ?? null
    const el = main && /(auto|scroll)/.test(getComputedStyle(main).overflowY) ? main : null
    if (el) {
      return {
        el,
        scrollTop: el.scrollTop,
        viewportTop: el.getBoundingClientRect().top,
        viewportHeight: el.clientHeight,
        scrollTo: (top, behavior) => el.scrollTo({ top, behavior }),
      }
    }
    return {
      el: null,
      scrollTop: window.scrollY,
      viewportTop: 0,
      viewportHeight: window.innerHeight,
      scrollTo: (top, behavior) => window.scrollTo({ top, behavior }),
    }
  }, [mainRef])
}
