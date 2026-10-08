import type { GymClass } from "@/lib/booking/types"
import type { ClassAction } from "@/lib/booking/classes"
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

/** One day: a title that sticks under the calendar, then its class cards. */
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
          {classes.map(({ gymClass, action }) => (
            <li key={gymClass.id} className="pb-3">
              <ClassCard
                gymClass={gymClass}
                action={action}
                pending={pendingId === gymClass.id}
                onAction={() => onAction(gymClass, action)}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
