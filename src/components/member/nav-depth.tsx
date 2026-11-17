"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * How many in-app pages sit behind the current one in this tab. `window.history.length` can't tell: it also
 * counts other sites, forward entries and pages from before a reload, so the back arrow could leave the app or
 * walk through stale pages. A fresh load (direct link, reload, PWA launch) starts at 0.
 */
let depth = 0
/** What the next route change is: a step back, a replace (same depth), or (default) a new page. */
let pending: "back" | "replace" | null = null

export const canGoBackInApp = () => depth > 0
/** Called when the back arrow uses router.back(), so the coming route change counts as a step back. */
export const markBack = () => {
  pending = "back"
}
/** Called before router.replace(), so the coming route change keeps the depth. */
export const markReplace = () => {
  pending = "replace"
}

/** Mounted once in the root layout: counts route changes, minus the ones made by going back. */
export function NavDepthTracker() {
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    const onPop = () => {
      pending = "back"
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (pending === "back") depth = Math.max(0, depth - 1)
    else if (pending !== "replace") depth += 1
    pending = null
  }, [pathname])

  return null
}
