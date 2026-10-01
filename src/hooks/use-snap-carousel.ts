"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react"

const subscribeNever = () => () => {}

type SnapCarouselOptions = {
  /**
   * For an endless carousel, render this many cloned slides before and after the real ones
   * (last N first, first N last). Landing on a clone silently jumps to the real slide it mirrors.
   */
  loopClones?: number
}

/**
 * Tracks the active slide of a CSS scroll-snap carousel.
 * The scroll container must be `position: relative` so children's offsetLeft is measured from it.
 * Snap alignment is read from each slide's computed `scroll-snap-align`, so it can change per breakpoint.
 */
export function useSnapCarousel<T extends HTMLElement>({ loopClones = 0 }: SnapCarouselOptions = {}) {
  const ref = useRef<T>(null)
  const [index, setIndex] = useState(0)
  // False on the server and during hydration; callers keep the leading clones hidden until then,
  // so the first real slide shows even if JS never runs.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false)
  const ready = loopClones === 0 || hydrated

  const snapTarget = useCallback((el: T, child: Element) => {
    const slide = child as HTMLElement
    if (getComputedStyle(slide).scrollSnapAlign.includes("center")) {
      return slide.offsetLeft + slide.offsetWidth / 2 - el.clientWidth / 2
    }
    return slide.offsetLeft - (parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0)
  }, [])

  const toRealIndex = useCallback(
    (childIndex: number, childCount: number) => {
      const realCount = childCount - loopClones * 2
      return (((childIndex - loopClones) % realCount) + realCount) % realCount
    },
    [loopClones]
  )

  // Once the clones are rendered, jump to the first real slide before the browser paints.
  useLayoutEffect(() => {
    const el = ref.current
    const firstReal = el?.children[loopClones]
    if (!ready || !loopClones || !el || !firstReal) return
    el.scrollLeft = snapTarget(el, firstReal)
  }, [ready, loopClones, snapTarget])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const closestChild = () => {
      let closest = 0
      let minDistance = Infinity
      Array.from(el.children).forEach((child, i) => {
        const distance = Math.abs(snapTarget(el, child) - el.scrollLeft)
        if (distance < minDistance) {
          minDistance = distance
          closest = i
        }
      })
      return closest
    }

    const update = () => {
      const count = el.children.length
      if (count === 0) return
      if (loopClones) {
        setIndex(toRealIndex(closestChild(), count))
        return
      }
      // A start-aligned carousel can't snap its trailing slides to the start edge.
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        setIndex(count - 1)
        return
      }
      setIndex(closestChild())
    }

    const wrapAround = () => {
      const count = el.children.length
      const child = closestChild()
      if (child >= loopClones && child < count - loopClones) return
      el.scrollLeft = snapTarget(el, el.children[loopClones + toRealIndex(child, count)])
    }

    // Wait for the scroll (including snapping) to finish before wrapping; fall back to a debounce.
    const supportsScrollEnd = "onscrollend" in window
    let settleTimer: number | undefined
    const onScroll = () => {
      update()
      if (loopClones && !supportsScrollEnd) {
        window.clearTimeout(settleTimer)
        settleTimer = window.setTimeout(wrapAround, 150)
      }
    }

    update()
    el.addEventListener("scroll", onScroll, { passive: true })
    if (loopClones && supportsScrollEnd) el.addEventListener("scrollend", wrapAround)
    return () => {
      window.clearTimeout(settleTimer)
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("scrollend", wrapAround)
    }
  }, [loopClones, snapTarget, toRealIndex])

  const scrollTo = useCallback(
    (i: number) => {
      const el = ref.current
      const slide = el?.children[i + loopClones]
      if (!el || !slide) return
      el.scrollTo({ left: snapTarget(el, slide), behavior: "smooth" })
    },
    [loopClones, snapTarget]
  )

  return { ref, index, scrollTo, ready }
}
