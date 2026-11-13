"use client"

import { useState } from "react"
import Image from "next/image"
import { CalendarDays, ChevronDown, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { GymClass } from "@/lib/booking/types"
import { classEndTime, inCancelLimit } from "@/lib/booking/classes"
import { formatDayTitle, fromKey } from "@/lib/booking/dates"
import { myMemberships } from "@/lib/booking/memberships"

type ConfirmBookingProps = {
  open: boolean
  onOpenChange(open: boolean): void
  /** Kept after closing so the content doesn't vanish mid-animation. */
  gymClass: GymClass | null
  onConfirm(membershipId: string): void
}

/**
 * 「要預約課程嗎？」: a bottom sheet on phones, a centred dialog from md up — same as the filter panel.
 * 取消限制時段 reminder (only inside the window), the class card with 老師叮嚀, then 使用會籍 (必填).
 */
export function ConfirmBooking({ open, onOpenChange, gymClass, onConfirm }: ConfirmBookingProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [membership, setMembership] = useState("")
  const [error, setError] = useState(false)

  // Each time it opens, start with no 會籍 picked.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setMembership("")
      setError(false)
    }
  }

  const confirm = () => {
    if (!membership) return setError(true)
    onConfirm(membership)
  }

  const body = (Header: typeof SheetHeader, Title: typeof SheetTitle, Footer: typeof SheetFooter) =>
    gymClass && (
      <>
        <Header className="px-4 pt-5 pb-0">
          <Title className="text-center text-lg leading-7 font-medium">要預約課程嗎？</Title>
        </Header>
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-4 pt-4">
          {inCancelLimit(gymClass) && (
            <p className="text-sm leading-5">課程已進入取消限制時段，記得準時上課喔！若取消預約，將記錄一次黃牌</p>
          )}
          <div className="flex flex-col gap-3 rounded-[10px] border border-neutral-200 p-4">
            <p className="text-base leading-6 font-medium">{gymClass.title}</p>
            <div className="flex flex-col gap-1.5 text-sm leading-5 text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <CalendarDays aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                {formatDayTitle(fromKey(gymClass.date))} {gymClass.start}-{classEndTime(gymClass)}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                {gymClass.venue}｜{gymClass.room}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm leading-5">
              {gymClass.teachers.map((teacher) => (
                <span key={teacher.id} className="flex items-center gap-1.5">
                  {teacher.avatar && (
                    <Image
                      src={teacher.avatar}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 rounded-full object-cover"
                    />
                  )}
                  {teacher.name}
                </span>
              ))}
            </div>
            {gymClass.teacherNote && (
              <p className="text-sm leading-5 break-words whitespace-pre-line">
                <span className="sr-only">老師叮嚀：</span>
                {gymClass.teacherNote}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="booking-membership" className="text-sm font-medium">
              使用會籍
              <span className="ml-0.5 text-red-600" aria-hidden>
                *
              </span>
            </label>
            <div className="relative">
              <select
                id="booking-membership"
                required
                value={membership}
                aria-invalid={error || undefined}
                aria-describedby={error ? "booking-membership-error" : undefined}
                onChange={(e) => {
                  setMembership(e.target.value)
                  setError(false)
                }}
                className={cn(
                  "h-12 w-full appearance-none rounded-[10px] border bg-white pr-11 pl-4 text-[15px] outline-none focus-visible:border-black",
                  error ? "border-red-600" : membership ? "border-black" : "border-neutral-200",
                  !membership && "text-neutral-500"
                )}
              >
                <option value="" disabled>
                  請選擇會籍
                </option>
                {myMemberships.map((m) => (
                  <option key={m.id} value={m.id} className="text-black">
                    {m.name}（{m.detail}）
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-neutral-500"
                strokeWidth={1.5}
              />
            </div>
            {error && (
              <p id="booking-membership-error" className="text-sm leading-5 text-red-600">
                請選擇使用會籍
              </p>
            )}
          </div>
        </div>
        <Footer className="m-0 flex-col gap-2 border-0 bg-white p-4 sm:flex-col">
          <Button className="h-10 w-full rounded-[8px]" onClick={confirm}>
            確認預約
          </Button>
          <Button variant="outline" className="h-10 w-full rounded-[8px]" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </Footer>
      </>
    )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-[500px]">
          {body(DialogHeader, DialogTitle, DialogFooter)}
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
        {body(SheetHeader, SheetTitle, SheetFooter)}
      </SheetContent>
    </Sheet>
  )
}
