import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import type { GymClass } from "@/lib/booking/types"
import { classEndTime, spotsLeft, type ClassAction } from "@/lib/booking/classes"
import { CLASS_INFO_PAGE_ENABLED } from "@/lib/booking/class-info"

const ACTION_LABEL: Record<ClassAction, string> = {
  book: "預約",
  booked: "取消預約",
  waitlist: "候補",
  waitlisted: "取消候補",
  ended: "已結束",
  attended: "已上課",
}

const OUTLINE = "border border-neutral-300 text-black"

/** Only 預約 is filled; every other button (課程資訊 included) is outlined. */
const ACTION_STYLE: Record<ClassAction, string> = {
  book: "bg-black text-white",
  booked: OUTLINE,
  waitlist: OUTLINE,
  waitlisted: OUTLINE,
  ended: OUTLINE,
  attended: OUTLINE,
}

const BUTTON = "flex h-8 flex-1 items-center justify-center rounded-full px-3 text-xs font-medium"

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
    <div className={cn("rounded-[10px] border border-neutral-200 p-3", ended && "opacity-50")}>
      <div className="min-w-0">
        <p className="truncate text-sm leading-5 text-muted-foreground">
          {gymClass.venue}｜{gymClass.room}
        </p>
        <p className="truncate text-xl leading-7 font-medium">{gymClass.title}</p>
        <p className="text-sm leading-5">
          {gymClass.start}-{classEndTime(gymClass)}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-sm leading-5">
          {/* Avatar + name open the teacher's page (not built yet); the name underlines on hover. */}
          <Link href={`/teachers/${gymClass.teacher.id}`} className="group flex min-w-0 items-center gap-1.5">
            {gymClass.teacher.avatar ? (
              <Image
                src={gymClass.teacher.avatar}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] text-neutral-700"
              >
                {gymClass.teacher.name[0]}
              </span>
            )}
            <span className="truncate underline-offset-2 group-hover:underline">{gymClass.teacher.name}</span>
          </Link>
          {!ended && (
            <span
              className={cn(
                "shrink-0",
                left === 0 ? "text-muted-foreground" : left <= 3 ? "text-orange-600" : "text-muted-foreground"
              )}
            >
              · {left === 0 ? "額滿" : `剩 ${left} 位`}
            </span>
          )}
        </div>
      </div>
      {/* Actions sit under the teacher, so the title gets the card's full width. */}
      {/* Side by side, equal widths. */}
      <div className="mt-3 flex gap-2">
        {CLASS_INFO_PAGE_ENABLED ? (
          <Link href={`/classes/${gymClass.id}`} className={cn(BUTTON, OUTLINE, "hover:bg-neutral-100")}>
            課程資訊
          </Link>
        ) : (
          <button type="button" className={cn(BUTTON, OUTLINE, "hover:bg-neutral-100")}>
            課程資訊
          </button>
        )}
        <button
          type="button"
          onClick={onAction}
          disabled={ended || pending}
          className={cn(
            BUTTON,
            "disabled:cursor-default",
            ACTION_STYLE[action],
            action === "book" ? "enabled:hover:bg-neutral-800" : "enabled:hover:bg-neutral-100",
            pending && "opacity-60"
          )}
        >
          {ACTION_LABEL[action]}
        </button>
      </div>
    </div>
  )
}
