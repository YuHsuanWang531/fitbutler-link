"use client"

import { useState } from "react"
import { ChevronLeft, XIcon } from "lucide-react"

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { TeacherProfile } from "@/components/member/teacher-profile"
import { TeacherTile } from "@/components/member/teacher-carousel"
import { getTeacher, teachers } from "@/lib/member-teachers"

/** Same as the 老師介紹 list page: the first ten for now. */
const LIST_LIMIT = 10

/**
 * 查看老師介紹 on the plan page, as a bottom sheet. With a teacher picked it opens on that teacher's 老師介紹; without one
 * on the 老師介紹 list, where a tile opens that teacher inside the sheet. A teacher always has ← back to the list. No
 * 團課內容／購買私教課 here.
 */
export function TeacherSheet({
  teacherId,
  open,
  onOpenChange,
}: {
  teacherId: string
  open: boolean
  onOpenChange(open: boolean): void
}) {
  // null = what the sheet opens on (the picked teacher, else the list); "list" or a teacher id once the member moves.
  const [view, setView] = useState<string | null>(null)
  const shown = view ?? (teacherId || "list")
  const teacher = shown === "list" ? undefined : getTeacher(shown)

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setView(null)
        onOpenChange(next)
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        aria-describedby={undefined}
        className="max-h-[90dvh] gap-0 rounded-t-[10px] pb-[env(safe-area-inset-bottom)] md:mx-auto md:max-w-[500px]"
      >
        <SheetHeader className="relative shrink-0 items-center px-12 pt-5 pb-4 text-center">
          {teacher && (
            <button
              type="button"
              aria-label="回到老師列表"
              onClick={() => setView("list")}
              className="absolute top-5 left-4 text-neutral-950"
            >
              <ChevronLeft className="size-6" strokeWidth={1.5} />
            </button>
          )}
          <SheetTitle className="text-lg leading-7 font-medium">老師介紹</SheetTitle>
          <SheetClose aria-label="關閉" className="absolute top-5 right-4 text-neutral-950">
            <XIcon className="size-6" strokeWidth={1.5} />
          </SheetClose>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto">
          {teacher ? (
            <TeacherProfile
              key={teacher.id}
              teacher={teacher}
              className="pt-0 md:pt-0"
              renderName={(name) => <h3 className="text-2xl leading-8 font-medium">{name}</h3>}
            />
          ) : (
            <ul className="grid grid-cols-2 gap-x-2 gap-y-4 px-4 pb-4">
              {teachers.slice(0, LIST_LIMIT).map((t) => (
                <li key={t.id} className="min-w-0">
                  <TeacherTile teacher={t} sizes="(max-width: 767px) 50vw, 240px" onSelect={() => setView(t.id)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
