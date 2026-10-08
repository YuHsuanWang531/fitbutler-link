import { cn } from "@/lib/utils"
import type { GymClass } from "@/lib/booking/types"
import { classEndTime, type ClassAction } from "@/lib/booking/classes"
import { formatDayTitle, toKey } from "@/lib/booking/dates"
import { ClassCard } from "@/components/booking/class-card"

type TimelineDayProps = {
  day: Date
  classes: { gymClass: GymClass; action: ClassAction }[]
  /** Shown when `classes` is empty. */
  emptyText: string
  pendingId: string | null
  onAction(gymClass: GymClass, action: ClassAction): void
}

/** One day: a title that sticks under the calendar, then its classes on a vertical rail. */
export function TimelineDay({ day, classes, emptyText, pendingId, onAction }: TimelineDayProps) {
  const key = toKey(day)
  return (
    <section data-day={key} aria-labelledby={`day-${key}`}>
      {/* Sticks right under the calendar, whose height (--zone-h) changes while it collapses. */}
      <h2
        id={`day-${key}`}
        className="sticky top-[calc(var(--booking-top)+var(--zone-h,0px))] z-10 flex h-11 items-center justify-between bg-white"
      >
        <span className="text-lg font-medium">{formatDayTitle(day)}</span>
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
                {/* The class's time range, start over end with a short bar between. */}
                <div className={cn("flex flex-col items-center pt-3 text-sm leading-5", ended && "opacity-50")}>
                  <span className="font-medium">{gymClass.start}</span>
                  <span aria-label="至" className="my-0.5 h-2.5 w-px bg-neutral-300" />
                  <span className="font-medium">{classEndTime(gymClass)}</span>
                </div>
                {/* Rail: one line from the first class's dot down to the bottom of the last card (even for one class). */}
                <div aria-hidden className="relative">
                  <span
                    className={cn(
                      "absolute left-1/2 w-px -translate-x-1/2 bg-neutral-300",
                      i === 0 ? "top-[22px]" : "top-0",
                      i === classes.length - 1 ? "bottom-3" : "bottom-0"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-[18px] left-1/2 size-2 -translate-x-1/2 rounded-full ring-4 ring-white",
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
