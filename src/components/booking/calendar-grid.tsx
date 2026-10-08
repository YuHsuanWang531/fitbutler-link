import type { Ref } from "react"

import { cn } from "@/lib/utils"
import { formatDayTitle, isSameMonth, toKey } from "@/lib/booking/dates"

type CalendarGridProps = {
  weeks: Date[][]
  /** Month being shown; days outside it are greyed out. `null` in week view. */
  month: Date | null
  todayKey: string
  selectedKey: string
  /** Days that have (filtered) classes. */
  dotKeys: Set<string>
  onSelect(day: Date): void
  ref?: Ref<HTMLDivElement>
}

/** One 44px row per week. Today is outlined, the selected day is a filled circle. */
export function CalendarGrid({ weeks, month, todayKey, selectedKey, dotKeys, onSelect, ref }: CalendarGridProps) {
  return (
    <div ref={ref}>
      {weeks.map((week) => (
        <div key={toKey(week[0])} className="grid h-11 grid-cols-7 px-2">
          {week.map((day) => {
            const key = toKey(day)
            const selected = key === selectedKey
            const outside = month !== null && !isSameMonth(day, month)
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(day)}
                aria-label={formatDayTitle(day)}
                aria-pressed={selected}
                className="flex flex-col items-center justify-center gap-[3px]"
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm",
                    selected
                      ? "bg-(--brand-accent) font-medium text-(--brand-on-accent-text)"
                      : cn(key === todayKey && "ring-1 ring-black ring-inset", outside && "text-neutral-300")
                  )}
                >
                  {day.getDate()}
                </span>
                {/* Stacked under the circle (never overlapping it); the slot stays reserved so numbers line up. */}
                <span
                  aria-hidden
                  className={cn(
                    "size-1 rounded-full",
                    !dotKeys.has(key) ? "invisible" : outside ? "bg-neutral-300" : "bg-neutral-500"
                  )}
                />
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
