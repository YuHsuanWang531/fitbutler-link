"use client"

import { CircleCheck } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * A short confirmation (e.g. 預約成功) floating above the tab bar on phones, near the bottom from md up.
 * Visibility is driven by the caller; `role="status"` makes screen readers announce it.
 */
export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 transition duration-200 motion-reduce:transition-none md:bottom-8",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      {message && (
        <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          <CircleCheck aria-hidden className="size-5" strokeWidth={1.75} />
          {message}
        </div>
      )}
    </div>
  )
}
