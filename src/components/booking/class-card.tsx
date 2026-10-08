import { cn } from "@/lib/utils"
import type { GymClass } from "@/lib/booking/types"
import { spotsLeft, type ClassAction } from "@/lib/booking/classes"

const ACTION_LABEL: Record<ClassAction, string> = {
  book: "預約",
  booked: "取消預約",
  waitlist: "候補",
  waitlisted: "取消候補",
  ended: "已結束",
  attended: "已上課",
}

const ACTION_STYLE: Record<ClassAction, string> = {
  book: "bg-black text-white",
  booked: "border border-neutral-300 text-black",
  waitlist: "border border-neutral-300 text-black",
  waitlisted: "border border-neutral-300 text-black",
  ended: "text-neutral-400",
  attended: "text-neutral-400",
}

type ClassCardProps = {
  gymClass: GymClass
  action: ClassAction
  pending: boolean
  onAction(): void
}

export function ClassCard({ gymClass, action, pending, onAction }: ClassCardProps) {
  const ended = action === "ended" || action === "attended"
  const left = spotsLeft(gymClass)
  return (
    <div className={cn("flex items-center gap-3 rounded-[10px] border border-neutral-200 p-3", ended && "opacity-50")}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs leading-4 text-muted-foreground">
          {gymClass.venue}｜{gymClass.room}
        </p>
        <p className="truncate text-lg leading-7 font-medium">{gymClass.title}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs leading-4">
          <span
            aria-hidden
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] text-neutral-700"
          >
            {gymClass.teacher.name[0]}
          </span>
          <span className="truncate">{gymClass.teacher.name}</span>
          {!ended && (
            <span className={cn("shrink-0", left === 0 ? "text-muted-foreground" : left <= 3 ? "text-orange-600" : "text-muted-foreground")}>
              · {left === 0 ? "額滿" : `剩 ${left} 位`}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={ended || pending}
        className={cn(
          "h-8 min-w-16 shrink-0 rounded-full px-3 text-xs font-medium disabled:cursor-default",
          ACTION_STYLE[action],
          pending && "opacity-60"
        )}
      >
        {ACTION_LABEL[action]}
      </button>
    </div>
  )
}
