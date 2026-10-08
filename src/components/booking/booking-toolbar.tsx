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
}

const iconButton = "flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100"

export function BookingToolbar({
  mode,
  title,
  activeFilterCount,
  onPrev,
  onNext,
  onOpenFilters,
  onModeChange,
}: BookingToolbarProps) {
  const unit = mode === "month" ? "個月" : "週"
  return (
    <div className="flex h-14 items-center justify-between gap-2 px-2 lg:px-4">
      <div className="flex min-w-0 items-center">
        <button type="button" onClick={onPrev} aria-label={`上一${unit}`} className={iconButton}>
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="min-w-28 text-center text-base leading-6 font-medium whitespace-nowrap">{title}</h1>
        <button type="button" onClick={onNext} aria-label={`下一${unit}`} className={iconButton}>
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label={activeFilterCount ? `篩選，已套用 ${activeFilterCount} 個條件` : "篩選"}
          className={cn(iconButton, "relative")}
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.75} />
          {activeFilterCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-black text-[10px] leading-none text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div role="radiogroup" aria-label="檢視方式" className="flex rounded-full bg-neutral-100 p-0.5">
          {(["month", "week"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              onClick={() => onModeChange(value)}
              className={cn(
                "h-8 rounded-full px-3.5 text-sm",
                mode === value ? "bg-white font-medium shadow-sm" : "text-neutral-500"
              )}
            >
              {value === "month" ? "月" : "週"}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
