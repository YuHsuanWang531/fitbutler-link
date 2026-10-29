import type { GymClass } from "@/lib/booking/types"
import type { ClassAction, ClassStatus } from "@/lib/booking/classes"
import { formatDayTitle, toKey } from "@/lib/booking/dates"
import { ClassCard } from "@/components/booking/class-card"

type TimelineDayProps = {
  day: Date
  classes: { gymClass: GymClass; status: ClassStatus }[]
  /** Shown when `classes` is empty. */
  emptyText: string
  pendingId: string | null
  /** The card scrolling to this day lands on (today: the next class to start); the first class otherwise. */
  anchorId?: string
  onAction(gymClass: GymClass, action: ClassAction): void
}

/** One day: a title that sticks under the calendar, then its class cards. */
export function TimelineDay({ day, classes, emptyText, pendingId, anchorId, onAction }: TimelineDayProps) {
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
          {classes.map(({ gymClass, status }) => (
            <li key={gymClass.id} className="pb-3" data-scroll-anchor={gymClass.id === anchorId || undefined}>
              <ClassCard
                gymClass={gymClass}
                status={status}
                pending={pendingId === gymClass.id}
                onAction={(action) => onAction(gymClass, action)}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
