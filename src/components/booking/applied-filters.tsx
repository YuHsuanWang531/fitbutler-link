import { X } from "lucide-react"

import type { ClassFilters } from "@/lib/booking/types"

type AppliedFiltersProps = {
  chips: { key: keyof ClassFilters; label: string }[]
  onRemove(key: keyof ClassFilters): void
  onClearAll(): void
}

/** Row of applied filter conditions; each can be removed on its own. */
export function AppliedFilters({ chips, onRemove, onClearAll }: AppliedFiltersProps) {
  if (chips.length === 0) return null
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:px-6 [&::-webkit-scrollbar]:hidden">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          aria-label={`移除篩選：${chip.label}`}
          className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-neutral-100 pr-2 pl-3 text-xs"
        >
          {chip.label}
          <X className="size-3.5" />
        </button>
      ))}
      {chips.length >= 2 && (
        <button type="button" onClick={onClearAll} className="h-7 shrink-0 px-1 text-xs text-neutral-500 underline">
          清除全部
        </button>
      )}
    </div>
  )
}
