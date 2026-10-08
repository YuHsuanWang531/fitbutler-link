"use client"

import { useEffect, useRef, type RefObject } from "react"

import { prefersReducedMotion } from "@/hooks/use-media-query"

/** Horizontal distance (px) that commits a swipe on release… */
const COMMIT_DISTANCE = 60
/** …or a quick flick: at least this far, at least this fast (px/ms). */
const FLICK_DISTANCE = 24
const FLICK_SPEED = 0.35
const SLIDE_OUT_MS = 160
const SLIDE_IN_MS = 240
/** Movement before we decide whether the gesture is horizontal (ours) or vertical (the page's scroll). */
const SLOP = 8

type Options = {
  enabled: boolean
  /** `1` = swiped left (next), `-1` = swiped right (previous). */
  onSwipe(direction: 1 | -1): void
}

/**
 * Drag `el` sideways with the finger (or mouse) and report a swipe past the threshold (or a quick flick).
 * A committed swipe slides the current content out, reports it (the caller swaps in the new content while it's
 * off-screen), then slides the new content in from the other side. Vertical gestures are left to the page
 * (`touch-action: pan-y`), and the click that follows a drag is swallowed so a swipe never also selects a date.
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

    let start: { id: number; x: number; y: number; time: number } | null = null
    let dragging = false
    let dx = 0
    let swallowClick = false
    let animating = false
    let timer: number | undefined
    let frame = 0

    const setOffset = (x: number, transition: string | null) => {
      el.style.transition = transition ?? "none"
      el.style.transform = x ? `translateX(${x}px)` : ""
    }

    /** Old week slides out the way the finger went, the new one comes in from the opposite side. */
    const commit = (direction: 1 | -1) => {
      if (prefersReducedMotion()) {
        setOffset(0, null)
        onSwipeRef.current(direction)
        return
      }
      const width = el.offsetWidth
      animating = true
      setOffset(-direction * width, `transform ${SLIDE_OUT_MS}ms ease-in`)
      timer = window.setTimeout(() => {
        onSwipeRef.current(direction)
        setOffset(direction * width, null)
        // Two frames: let React render the new week off-screen before it slides in.
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            setOffset(0, `transform ${SLIDE_IN_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`)
            animating = false
          })
        })
      }, SLIDE_OUT_MS)
    }

    const onDown = (e: PointerEvent) => {
      if (animating || (e.pointerType === "mouse" && e.button !== 0)) return
      start = { id: e.pointerId, x: e.clientX, y: e.clientY, time: e.timeStamp }
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
      setOffset(dx, null)
    }
    const onUp = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return
      const speed = Math.abs(dx) / Math.max(1, e.timeStamp - start.time)
      start = null
      if (!dragging) return
      dragging = false
      swallowClick = true
      const flick = Math.abs(dx) >= FLICK_DISTANCE && speed >= FLICK_SPEED
      if (Math.abs(dx) >= COMMIT_DISTANCE || flick) commit(dx < 0 ? 1 : -1)
      else setOffset(0, prefersReducedMotion() ? null : "transform 200ms ease-out")
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
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      el.style.touchAction = ""
      setOffset(0, null)
    }
  }, [ref, enabled])
}
