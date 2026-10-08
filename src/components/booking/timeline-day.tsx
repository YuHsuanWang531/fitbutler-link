import { cn } from "@/lib/utils"
import type { GymClass } from "@/lib/booking/types"
import type { ClassAction } from "@/lib/booking/classes"
import { formatDayTitle, toKey } from "@/lib/booking/dates"
import { ClassCard } from "@/components/booking/class-card"

type TimelineDayProps = {
  day: Date
  isToday: boolean
  classes: { gymClass: GymClass; action: ClassAction }[]
  /** Shown when `classes` is empty. */
  emptyText: string
  pendingId: string | null
  onAction(gymClass: GymClass, action: ClassAction): void
}

/** One day: a title that sticks under the calendar, then its classes on a vertical rail. */
export function TimelineDay({ day, isToday, classes, emptyText, pendingId, onAction }: TimelineDayProps) {
  const key = toKey(day)
  return (
    <section data-day={key} aria-labelledby={`day-${key}`}>
      {/* Sticks right under the calendar, whose height (--zone-h) changes while it collapses. */}
      <h2
        id={`day-${key}`}
        className="sticky top-[calc(var(--booking-top)+var(--zone-h,0px))] z-10 flex h-11 items-center justify-between bg-white text-sm"
      >
        <span className="flex items-center gap-2 font-medium">
          {formatDayTitle(day)}
          {isToday && <span className="rounded bg-black px-1.5 py-0.5 text-[11px] leading-none text-white">今天</span>}
        </span>
        {classes.length > 0 && <span className="text-xs text-muted-foreground">{classes.length} 堂</span>}
      </h2>

      {classes.length === 0 ? (
        <p className="pb-4 text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ol className="pb-2">
          {classes.map(({ gymClass, action }, i) => {
            const ended = action === "ended" || action === "attended"
            return (
              <li key={gymClass.id} className="grid grid-cols-[44px_12px_minmax(0,1fr)] gap-x-3">
                <div className={cn("pt-3 text-right", ended && "opacity-50")}>
                  <div className="text-sm leading-5 font-medium">{gymClass.start}</div>
                  <div className="text-xs leading-4 text-muted-foreground">{gymClass.durationMin} 分</div>
                </div>
                {/* Rail: one line through every class's dot, from the first dot to the last. */}
                <div aria-hidden className="relative">
                  {classes.length > 1 && (
                    <span
                      className={cn(
                        "absolute left-1/2 w-px -translate-x-1/2 bg-neutral-200",
                        i === 0 ? "top-[22px]" : "top-0",
                        i === classes.length - 1 ? "h-[22px]" : "bottom-0"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "absolute top-[17px] left-1/2 size-2.5 -translate-x-1/2 rounded-full ring-4 ring-white",
                      ended ? "bg-neutral-300" : "bg-black"
                    )}
                  />
                </div>
                <div className="pb-3">
                  <ClassCard
                    gymClass={gymClass}
                    action={action}
                    pending={pendingId === gymClass.id}
                    onAction={() => onAction(gymClass, action)}
                  />
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
