"use client"

import Image from "next/image"
import { CalendarDays, MapPin } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { GymClass } from "@/lib/booking/types"
import { classEndTime } from "@/lib/booking/classes"
import { formatDayTitle, fromKey } from "@/lib/booking/dates"

type ConfirmBookingProps = {
  open: boolean
  onOpenChange(open: boolean): void
  /** Kept after closing so the content doesn't vanish mid-animation. */
  gymClass: GymClass | null
  onConfirm(): void
}

/** 「確認預約」: a bottom sheet on phones, a centred dialog from md up — same as the filter panel. */
export function ConfirmBooking({ open, onOpenChange, gymClass, onConfirm }: ConfirmBookingProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const body = (Header: typeof SheetHeader, Title: typeof SheetTitle, Footer: typeof SheetFooter) =>
    gymClass && (
      <>
        <Header className="px-4 pt-4 pb-2">
          <Title className="text-base font-medium">確認預約</Title>
        </Header>
        <div className="flex flex-col gap-3 px-4 py-2">
          <p className="text-xl leading-7 font-medium">{gymClass.title}</p>
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
          <div className="flex items-center gap-4 text-sm leading-5">
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
        </div>
        <Footer className="flex-row gap-2 px-4 pt-4 pb-4">
          <Button variant="outline" className="h-10 flex-1 rounded-full" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button className="h-10 flex-1 rounded-full" onClick={onConfirm}>
            確認預約
          </Button>
        </Footer>
      </>
    )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-md">{body(DialogHeader, DialogTitle, DialogFooter)}</DialogContent>
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
