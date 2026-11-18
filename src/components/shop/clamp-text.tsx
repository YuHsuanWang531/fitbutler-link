"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/** Text cut at two lines; only when it's longer, a 顯示更多 / 收合 toggle appears under it. */
export function ClampText({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)

  // Measure while clamped; re-check when the width changes (rotation, desktop resize).
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || expanded) return
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [children, expanded])

  return (
    <div className="flex flex-col gap-1">
      <p ref={ref} className={cn(className, !expanded && "line-clamp-2")}>
        {children}
      </p>
      {(overflows || expanded) && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-0.5 self-center text-sm leading-5 font-medium text-black"
        >
          {expanded ? "收合" : "顯示更多"}
          <ChevronDown aria-hidden className={cn("size-4 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  )
}
