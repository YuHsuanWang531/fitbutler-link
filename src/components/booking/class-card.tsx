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

const BUTTON = "flex h-9 flex-1 items-center justify-center rounded-full px-3 text-sm font-medium"

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
    <div className={cn("rounded-[10px] border border-neutral-200 p-4", ended && "opacity-50")}>
      <div className="flex gap-3">
        <div className="flex shrink-0 flex-col items-center">
          <span className="text-lg leading-7 font-semibold">{gymClass.start}</span>
          <span aria-label="至" className="h-3 w-px bg-neutral-400" />
          <span className="text-base leading-7 text-muted-foreground">{classEndTime(gymClass)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-6 text-muted-foreground">
            {gymClass.venue}｜{gymClass.room}
          </p>
          <p className="truncate text-xl leading-7 font-medium">{gymClass.title}</p>
          <div className="mt-2 flex items-center gap-2 text-sm leading-5">
            <TeacherLink gymClass={gymClass} />
            {!ended && (
              <span
                className={cn(
                  "flex h-7 shrink-0 items-center rounded-full px-2.5",
                  left === 0
                    ? "bg-neutral-100 text-neutral-500"
                    : left <= 3
                      ? "bg-orange-50 text-orange-600"
                      : "bg-emerald-50 text-emerald-700"
                )}
              >
                {left === 0 ? "額滿" : `剩 ${left} 位`}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <CardActions gymClass={gymClass} action={action} pending={pending} onAction={onAction} />
      </div>
    </div>
  )
}

/** Avatar + name open the teacher's page (not built yet); the name underlines on hover. */
function TeacherLink({ gymClass }: { gymClass: GymClass }) {
  return (
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
  )
}

/** 課程資訊 + the class action, side by side at equal widths. */
function CardActions({ gymClass, action, pending, onAction }: ClassCardProps) {
  const ended = action === "ended" || action === "attended"
  return (
    <div className="flex gap-2">
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
  )
}
