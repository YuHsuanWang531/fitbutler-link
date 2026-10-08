"use client"

import { useEffect, useRef, type RefObject } from "react"

import { prefersReducedMotion } from "@/hooks/use-media-query"

/** Horizontal distance (px) that commits a swipe on release. */
const COMMIT_DISTANCE = 60
/** Movement before we decide whether the gesture is horizontal (ours) or vertical (the page's scroll). */
const SLOP = 8

type Options = {
  enabled: boolean
  /** `1` = swiped left (next), `-1` = swiped right (previous). */
  onSwipe(direction: 1 | -1): void
}

/**
 * Drag `el` sideways with the finger (or mouse) and report a swipe past the threshold.
 * Vertical gestures are left to the page (`touch-action: pan-y`), and the click that
 * follows a drag is swallowed so a swipe never also selects a date.
 */
export function useHorizontalSwipe(ref: RefObject<HTMLElement | null>, { enabled, onSwipe }: Options) {
  const onSwipeRef = useRef(onSwipe)
  useEffect(() => {
    onSwipeRef.current = onSwipe
  })

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    el.style.touchAction = "pan-y"

    let start: { id: number; x: number; y: number } | null = null
    let dragging = false
    let dx = 0
    let swallowClick = false

    const setOffset = (x: number, animate: boolean) => {
      el.style.transition = animate && !prefersReducedMotion() ? "transform 200ms ease-out" : "none"
      el.style.transform = x ? `translateX(${x}px)` : ""
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return
      start = { id: e.pointerId, x: e.clientX, y: e.clientY }
      dragging = false
      dx = 0
    }
    const onMove = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return
      dx = e.clientX - start.x
      const dy = e.clientY - start.y
      if (!dragging) {
        if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return
        if (Math.abs(dy) >= Math.abs(dx)) {
          start = null // vertical: let the page scroll
          return
        }
        dragging = true
        try {
          el.setPointerCapture(e.pointerId) // keep receiving moves if the finger leaves the row
        } catch {
          // Pointer already released; the drag still works from bubbling events.
        }
      }
      setOffset(dx, false)
    }
    const onUp = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return
      start = null
      if (!dragging) return
      dragging = false
      swallowClick = true
      setOffset(0, Math.abs(dx) < COMMIT_DISTANCE)
      if (Math.abs(dx) >= COMMIT_DISTANCE) onSwipeRef.current(dx < 0 ? 1 : -1)
    }
    const onClick = (e: MouseEvent) => {
      if (!swallowClick) return
      swallowClick = false
      e.preventDefault()
      e.stopPropagation()
    }

    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)
    el.addEventListener("click", onClick, { capture: true })
    return () => {
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
      el.removeEventListener("click", onClick, { capture: true })
      el.style.touchAction = ""
      setOffset(0, false)
    }
  }, [ref, enabled])
}
