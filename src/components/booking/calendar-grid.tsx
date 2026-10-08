import type { Ref } from "react"

import { cn } from "@/lib/utils"
import { formatDayTitle, isSameMonth, toKey } from "@/lib/booking/dates"

type CalendarGridProps = {
  weeks: Date[][]
  /** Month being shown; days outside it are greyed out. `null` in week view. */
  month: Date | null
  todayKey: string
  selectedKey: string
  onSelect(day: Date): void
  ref?: Ref<HTMLDivElement>
}

/** One 44px row per week. Today is outlined, the selected day is a filled circle. */
export function CalendarGrid({ weeks, month, todayKey, selectedKey, onSelect, ref }: CalendarGridProps) {
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
                className="group flex items-center justify-center"
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm",
                    selected
                      ? "bg-(--brand-accent) font-medium text-(--brand-on-accent-text)"
                      : cn(
                          "group-hover:bg-neutral-100",
                          key === todayKey && "ring-1 ring-black ring-inset",
                          outside && "text-neutral-300"
                        )
                  )}
                >
                  {day.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
