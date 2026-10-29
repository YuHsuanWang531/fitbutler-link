import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import type { GymClass, Teacher } from "@/lib/booking/types"
import { classEndTime, spotsLeft, statusAction, type ClassAction, type ClassStatus } from "@/lib/booking/classes"
import { CLASS_INFO_PAGE_ENABLED } from "@/lib/booking/class-info"

const ACTION_LABEL: Record<ClassAction, string> = {
  book: "預約",
  booked: "取消預約",
  waitlist: "候補",
  waitlisted: "取消候補",
}

const OUTLINE = "border border-neutral-300 text-black"

/** 預約 and 候補 are filled; cancelling and 課程資訊 are outlined. */
const ACTION_STYLE: Record<ClassAction, string> = {
  book: "bg-black text-white enabled:hover:bg-neutral-800",
  waitlist: "bg-black text-white enabled:hover:bg-neutral-800",
  booked: cn(OUTLINE, "enabled:hover:bg-neutral-100"),
  waitlisted: cn(OUTLINE, "enabled:hover:bg-neutral-100"),
}

const GREY = "bg-neutral-100 text-neutral-500"
const RED = "bg-red-50 text-red-600"
const BLUE = "bg-sky-50 text-sky-600"
const GREEN = "bg-emerald-50 text-emerald-700"

/** The top-right tag for each status (none once the class is over). */
function statusTag(status: ClassStatus, gymClass: GymClass): { label: string; style: string } | null {
  switch (status) {
    case "close":
      return null
    case "stop":
      return { label: "停課", style: RED }
    case "inClass":
      return { label: "上課中", style: GREY }
    case "notOpen":
      return { label: "尚未開放", style: GREY }
    case "free":
      return { label: "免預約", style: GREY }
    case "full":
      return { label: "已額滿", style: RED }
    case "waiting":
      return { label: "可候補", style: "bg-orange-50 text-orange-600" }
    case "almostFull":
    case "open":
      return { label: `剩 ${spotsLeft(gymClass)} 位`, style: GREEN }
    case "reserved":
      return { label: "已預約", style: BLUE }
    case "waitlisted":
      return { label: gymClass.waitlistPosition ? `候補順位 ${gymClass.waitlistPosition}` : "已候補", style: BLUE }
  }
}

const BUTTON = "flex h-9 flex-1 items-center justify-center rounded-full px-3 text-sm font-medium"

type ClassCardProps = {
  gymClass: GymClass
  status: ClassStatus
  pending: boolean
  onAction(action: ClassAction): void
}

export function ClassCard({ gymClass, status, pending, onAction }: ClassCardProps) {
  const closed = status === "close"
  const tag = statusTag(status, gymClass)
  return (
    <div className={cn("rounded-[10px] border border-neutral-200 p-4", closed && "opacity-50")}>
      <div className="flex gap-3">
        <div className="flex shrink-0 flex-col items-center">
          <span className="text-lg leading-7 font-semibold">{gymClass.start}</span>
          <span aria-label="至" className="h-3 w-px bg-neutral-400" />
          <span className="text-base leading-7 text-muted-foreground">{classEndTime(gymClass)}</span>
        </div>
        <div className="min-w-0 flex-1">
          {/* Venue on the left, the status tag in the card's top-right corner. */}
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm leading-6 text-muted-foreground">
              {gymClass.venue}｜{gymClass.room}
            </p>
            {tag && (
              <span className={cn("flex h-6 shrink-0 items-center rounded-full px-2.5 text-sm", tag.style)}>
                {tag.label}
              </span>
            )}
          </div>
          <p className="truncate text-xl leading-7 font-medium">{gymClass.title}</p>
          <div className="mt-2 flex min-w-0 items-center gap-4 text-sm leading-5">
            {gymClass.teachers.map((teacher) => (
              <TeacherLink key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </div>
      </div>
      {!closed && <CardActions gymClass={gymClass} status={status} pending={pending} onAction={onAction} />}
    </div>
  )
}

/** Avatar + name open the teacher's page (not built yet); the name underlines on hover. */
function TeacherLink({ teacher }: { teacher: Teacher }) {
  return (
    <Link href={`/teachers/${teacher.id}`} className="group flex min-w-0 items-center gap-1.5">
      {teacher.avatar ? (
        <Image
          src={teacher.avatar}
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
          {teacher.name[0]}
        </span>
      )}
      <span className="truncate underline-offset-2 group-hover:underline">{teacher.name}</span>
    </Link>
  )
}

/**
 * 課程資訊 (only when the gym filled it in) and the status's action, side by side at equal widths; either
 * one alone takes the full width, and with neither the row is left out.
 */
function CardActions({ gymClass, status, pending, onAction }: ClassCardProps) {
  const action = statusAction(status)
  if (!gymClass.hasInfo && !action) return null
  return (
    <div className="mt-3 flex gap-2">
      {gymClass.hasInfo &&
        (CLASS_INFO_PAGE_ENABLED ? (
          <Link href={`/classes/${gymClass.id}`} className={cn(BUTTON, OUTLINE, "hover:bg-neutral-100")}>
            課程資訊
          </Link>
        ) : (
          <button type="button" className={cn(BUTTON, OUTLINE, "hover:bg-neutral-100")}>
            課程資訊
          </button>
        ))}
      {action && (
        <button
          type="button"
          onClick={() => onAction(action)}
          disabled={pending}
          className={cn(BUTTON, "disabled:cursor-default", ACTION_STYLE[action], pending && "opacity-60")}
        >
          {ACTION_LABEL[action]}
        </button>
      )}
    </div>
  )
}
