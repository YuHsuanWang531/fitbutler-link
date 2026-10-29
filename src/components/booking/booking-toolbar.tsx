import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

export type BookingMode = "month" | "week"

type BookingToolbarProps = {
  mode: BookingMode
  title: string
  activeFilterCount: number
  onPrev(): void
  onNext(): void
  onOpenFilters(): void
  onModeChange(mode: BookingMode): void
  onToday(): void
}

/** Every icon in the row: 22px, 1.75 stroke, so the arrows and the filter icon carry the same weight. */
const ICON = "size-[22px]"
const ICON_STROKE = 1.75

const iconButton = "flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100"

export function BookingToolbar({
  mode,
  title,
  activeFilterCount,
  onPrev,
  onNext,
  onOpenFilters,
  onModeChange,
  onToday,
}: BookingToolbarProps) {
  const unit = mode === "month" ? "個月" : "週"
  return (
    <div className="flex h-14 items-center justify-between gap-2 px-2 lg:px-4">
      <div className="flex min-w-0 items-center">
        <button type="button" onClick={onPrev} aria-label={`上一${unit}`} className={iconButton}>
          <ChevronLeft className={ICON} strokeWidth={ICON_STROKE} />
        </button>
        <h2 className="text-center md:min-w-32 text-lg leading-7 font-medium whitespace-nowrap">{title}</h2>
        <button type="button" onClick={onNext} aria-label={`下一${unit}`} className={iconButton}>
          <ChevronRight className={ICON} strokeWidth={ICON_STROKE} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* On phones 篩選 is in the page header instead. */}
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label={activeFilterCount ? `篩選，已套用 ${activeFilterCount} 個條件` : "篩選"}
          className={cn(iconButton, "relative hidden md:flex")}
        >
          <SlidersHorizontal className={ICON} strokeWidth={ICON_STROKE} />
          {activeFilterCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-black text-[10px] leading-none text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        {/* 今天 sits right after the 月 / 週 switch. */}
        <div className="flex items-center gap-1.5">
          <div role="radiogroup" aria-label="檢視方式" className="flex rounded-full bg-neutral-100 p-0.5">
            {(["month", "week"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={mode === value}
                onClick={() => onModeChange(value)}
                className={cn(
                  "h-9 rounded-full px-4 text-[15px]",
                  mode === value ? "bg-white font-medium shadow-sm" : "text-neutral-500 hover:text-black"
                )}
              >
                {value === "month" ? "月" : "週"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onToday}
            className="h-9 shrink-0 rounded-full border border-neutral-300 px-3 text-[15px] hover:bg-neutral-100"
          >
            今天
          </button>
        </div>
      </div>
    </div>
  )
}
