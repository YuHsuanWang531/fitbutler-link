"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"

import { useScrollTarget } from "@/components/member/scroll-container"
import { prefersReducedMotion } from "@/hooks/use-media-query"

/**
 * Links the booking calendar to scrolling.
 *
 * The sticky zone (toolbar + calendar) shrinks as you scroll: with N rows of height R it can lose
 * D = (N − 1) · R, and progress p = (scroll − stuck point) / D. A spacer of height p · D sits right under
 * the zone, so zone + spacer never changes height: the timeline moves 1:1 with the finger and every day
 * section keeps a fixed position, which makes "which day is under the calendar" and "scroll to a day"
 * plain arithmetic. Per-frame values are written straight to the DOM; React state only changes when the
 * active day or the collapsed flag does.
 */

type Elements = {
  root: RefObject<HTMLDivElement | null>
  /** Sticky zone: toolbar, filters, weekday labels, calendar, handle. */
  zone: RefObject<HTMLDivElement | null>
  /** Clips the calendar rows; its height shrinks while collapsing. */
  calendarViewport: RefObject<HTMLDivElement | null>
  /** The calendar rows themselves; slides up so the selected week stays visible. */
  calendarRows: RefObject<HTMLDivElement | null>
  /** Compensates for the zone's lost height. */
  spacer: RefObject<HTMLDivElement | null>
}

type Options = Elements & {
  /** Month view collapses; week view has a single row. */
  collapsible: boolean
  /** Row index of the selected week. */
  weekIndex: number
  /** Changes whenever the timeline's content (and therefore its layout) changes. */
  layoutKey: string
  onActiveDayChange(key: string): void
  /** Any user scroll (not one we started), e.g. to close the expanded-month overlay. */
  onUserScroll(): void
}

type Metrics = {
  zoneTop: number
  zoneFullHeight: number
  rowHeight: number
  rows: number
  collapseDistance: number
  /** Scroll offset at which the zone sticks. */
  stuckAt: number
  /** Day sections in document order, with their (collapse-independent) scroll position. */
  days: { key: string; top: number }[]
  maxScroll: number
}

const SCROLL_END_FALLBACK_MS = 150
/** A scroll that stops part-way settles in the direction it was going once it has covered this much of the fold. */
const SNAP_THRESHOLD = 0.15

const clamp = (v: number) => Math.min(1, Math.max(0, v))

export function useCalendarScroll(options: Options) {
  const getTarget = useScrollTarget()
  const opts = useRef(options)
  useLayoutEffect(() => {
    opts.current = options
  })

  const metrics = useRef<Metrics | null>(null)
  const progress = useRef(0)
  const activeKey = useRef<string | null>(null)
  const collapsedRef = useRef(false)
  const [collapsed, setCollapsed] = useState(false)
  /** True while a scroll we started is animating: the active day is already set, don't recompute it. */
  const programmatic = useRef(false)
  const programmaticTimer = useRef<number | undefined>(undefined)
  /** A day the user picked that sits too low to reach the calendar; it stays active at the bottom until they scroll. */
  const heldKey = useRef<string | null>(null)
  /**
   * Scroll offset where collapsing starts. Normally the stuck point; `scrollToDayExpanded` moves it so the month
   * can be fully open with any day under it. Resets once the user is back at the top or picks a date.
   */
  const collapseOrigin = useRef<number | null>(null)

  const apply = useCallback((scrollTop: number, { skipActiveDay = false } = {}) => {
    const m = metrics.current
    const { root, calendarViewport, calendarRows, spacer } = opts.current
    if (!m || !root.current || !calendarViewport.current || !calendarRows.current || !spacer.current) return

    if (scrollTop <= m.stuckAt) collapseOrigin.current = null
    const origin = collapseOrigin.current ?? m.stuckAt
    const p = m.collapseDistance ? clamp((scrollTop - origin) / m.collapseDistance) : 0
    const lost = p * m.collapseDistance
    progress.current = p
    calendarViewport.current.style.height = `${m.rows * m.rowHeight - lost}px`
    calendarRows.current.style.transform = `translateY(${-p * opts.current.weekIndex * m.rowHeight}px)`
    spacer.current.style.height = `${lost}px`
    root.current.style.setProperty("--zone-h", `${m.zoneFullHeight - lost}px`)
    root.current.style.setProperty("--collapse", String(p))

    const isCollapsed = m.collapseDistance > 0 && p >= 1
    if (isCollapsed !== collapsedRef.current) {
      collapsedRef.current = isCollapsed
      setCollapsed(isCollapsed)
    }

    if (programmatic.current || skipActiveDay) return
    // The active day is the last one whose title has reached the bottom of the sticky zone. The last few
    // days may never get there (the tail is only as tall as its button), so at the very bottom it's the last day.
    const line = scrollTop + m.zoneTop + m.zoneFullHeight - lost + 1
    let key = m.days[0]?.key
    if (scrollTop >= m.maxScroll - 1) key = heldKey.current ?? m.days[m.days.length - 1]?.key
    else {
      for (const day of m.days) {
        if (day.top > line) break
        key = day.key
      }
    }
    if (key && key !== activeKey.current) {
      activeKey.current = key
      opts.current.onActiveDayChange(key)
    }
  }, [])

  const measure = useCallback(({ skipActiveDay = false } = {}) => {
    const { root, zone, calendarViewport, calendarRows, collapsible } = opts.current
    if (!root.current || !zone.current || !calendarViewport.current || !calendarRows.current) return
    const target = getTarget()

    const zoneTop = parseFloat(getComputedStyle(zone.current).top) || 0
    const rows = calendarRows.current.children.length
    const rowHeight = (calendarRows.current.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0
    const collapseDistance = collapsible ? (rows - 1) * rowHeight : 0
    // The zone's height with the calendar fully open, whatever its current collapse.
    const zoneFullHeight = zone.current.offsetHeight - calendarViewport.current.offsetHeight + rows * rowHeight
    const rootTop = root.current.getBoundingClientRect().top - target.viewportTop + target.scrollTop
    const sections = Array.from(root.current.querySelectorAll<HTMLElement>("[data-day]"))
    const scrollHeight = target.el ? target.el.scrollHeight : document.documentElement.scrollHeight

    metrics.current = {
      zoneTop,
      zoneFullHeight,
      rowHeight,
      rows,
      collapseDistance,
      stuckAt: rootTop - zoneTop,
      days: sections.map((el) => ({ key: el.dataset.day!, top: rootTop + el.offsetTop })),
      maxScroll: scrollHeight - target.viewportHeight,
    }

    apply(target.scrollTop, { skipActiveDay })
  }, [apply, getTarget])

  const endProgrammatic = useCallback(() => {
    programmatic.current = false
    window.clearTimeout(programmaticTimer.current)
  }, [])

  /** `hold`: keep the caller's active day even for an instant scroll (e.g. one clamped at the bottom). */
  const scrollTo = useCallback(
    (top: number, smooth: boolean, hold = false) => {
      const target = getTarget()
      const behavior: ScrollBehavior = smooth && !prefersReducedMotion() ? "smooth" : "instant"
      if (Math.abs(target.scrollTop - top) < 1) return apply(target.scrollTop, { skipActiveDay: hold })
      if (behavior === "smooth" || hold) {
        programmatic.current = true
        window.clearTimeout(programmaticTimer.current)
        programmaticTimer.current = window.setTimeout(endProgrammatic, 1500)
      }
      target.scrollTo(top, behavior)
      if (behavior === "instant") apply(getTarget().scrollTop, { skipActiveDay: hold })
    },
    [apply, endProgrammatic, getTarget]
  )

  /** Scroll so the day's title sits right under the (collapsed) calendar. */
  const scrollToDay = useCallback(
    (key: string, { smooth }: { smooth: boolean }) => {
      // Don't let the pre-scroll position report its own day; the caller already selected `key`.
      measure({ skipActiveDay: true })
      const m = metrics.current
      const day = m?.days.find((d) => d.key === key)
      if (!m || !day) return
      activeKey.current = key
      collapseOrigin.current = null
      opts.current.onActiveDayChange(key)
      const top = Math.max(0, day.top - m.zoneTop - (m.zoneFullHeight - m.collapseDistance))
      // Late days can't reach the calendar; stop at the bottom but keep the day that was asked for.
      heldKey.current = top > m.maxScroll ? key : null
      scrollTo(Math.min(top, m.maxScroll), smooth, top > m.maxScroll)
    },
    [measure, scrollTo]
  )

  /** Back to the top with the month fully open. */
  const scrollToTop = useCallback(() => {
    measure({ skipActiveDay: true })
    const m = metrics.current
    if (!m) return
    activeKey.current = null
    heldKey.current = null
    collapseOrigin.current = null
    scrollTo(Math.max(0, m.stuckAt), false)
  }, [measure, scrollTo])

  /**
   * Show `key` right under the fully open month: collapsing then starts from here, so scrolling down still
   * folds the month away 1:1 and scrolling up keeps it open.
   */
  const scrollToDayExpanded = useCallback(
    (key: string) => {
      measure({ skipActiveDay: true })
      const m = metrics.current
      const day = m?.days.find((d) => d.key === key)
      if (!m || !day) return
      const top = Math.max(m.stuckAt, day.top - m.zoneTop - m.zoneFullHeight)
      const reachable = Math.min(top, m.maxScroll)
      collapseOrigin.current = reachable > m.stuckAt ? reachable : null
      heldKey.current = top > m.maxScroll ? key : null
      activeKey.current = key
      opts.current.onActiveDayChange(key)
      scrollTo(reachable, false, true)
    },
    [measure, scrollTo]
  )

  // Re-measure whenever the content changes…
  useLayoutEffect(() => {
    measure()
  }, [measure, options.layoutKey, options.collapsible])

  // …and keep the selected week in view as the selection moves.
  useLayoutEffect(() => {
    apply(getTarget().scrollTop)
  }, [apply, getTarget, options.weekIndex])

  useEffect(() => {
    const root = opts.current.root.current
    if (!root) return
    let frame = 0
    let endTimer: number | undefined
    const supportsScrollEnd = "onscrollend" in window
    /** Progress when the current scroll began, to tell which way it's going when it stops. */
    let startProgress: number | null = null

    const isOurs = (e: Event) => e.target === (getTarget().el ?? document)

    const onScrollEnd = () => {
      if (programmatic.current) {
        startProgress = null
        // Drop the frame queued during our own scroll; it would recompute the active day we just set.
        cancelAnimationFrame(frame)
        return endProgrammatic()
      }
      // scrollend can arrive before the next frame's apply(); bring progress up to date first.
      cancelAnimationFrame(frame)
      apply(getTarget().scrollTop)
      const m = metrics.current
      const p = progress.current
      const from = startProgress ?? p
      startProgress = null
      // Never leave the calendar half-collapsed. Settle the way the scroll was heading, so even a slow, short
      // drag folds (or unfolds) the month once it has moved a little; with no clear direction, the nearer end.
      const origin = collapseOrigin.current ?? m?.stuckAt ?? 0
      if (m?.collapseDistance && p > 0 && p < 1) {
        const collapse = p > from ? p >= SNAP_THRESHOLD : p < from ? p > 1 - SNAP_THRESHOLD : p >= 0.5
        scrollTo(origin + (collapse ? m.collapseDistance : 0), true)
      }
    }

    const onScroll = (e: Event) => {
      if (!isOurs(e)) return
      if (!programmatic.current) {
        startProgress ??= progress.current
        heldKey.current = null
        opts.current.onUserScroll()
      }
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => apply(getTarget().scrollTop))
      if (!supportsScrollEnd) {
        window.clearTimeout(endTimer)
        endTimer = window.setTimeout(onScrollEnd, SCROLL_END_FALLBACK_MS)
      }
    }
    const onNativeScrollEnd = (e: Event) => {
      if (isOurs(e)) onScrollEnd()
    }

    // Capture on document sees both window scrolls and the md+ card's own scrolls.
    document.addEventListener("scroll", onScroll, { capture: true, passive: true })
    if (supportsScrollEnd) document.addEventListener("scrollend", onNativeScrollEnd, { capture: true })
    const remeasure = () => measure()
    const resize = new ResizeObserver(remeasure)
    resize.observe(root)
    window.addEventListener("resize", remeasure)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(endTimer)
      document.removeEventListener("scroll", onScroll, { capture: true })
      document.removeEventListener("scrollend", onNativeScrollEnd, { capture: true })
      resize.disconnect()
      window.removeEventListener("resize", remeasure)
    }
  }, [apply, endProgrammatic, getTarget, measure, scrollTo])

  return { collapsed, scrollToDay, scrollToDayExpanded, scrollToTop, measure }
}
