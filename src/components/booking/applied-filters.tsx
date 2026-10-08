import { X } from "lucide-react"

import type { ClassFilters } from "@/lib/booking/types"

/** `clear`: the filter fields that removing this chip resets. */
export type FilterChip = { id: string; label: string; clear: Partial<ClassFilters> }

type AppliedFiltersProps = {
  chips: FilterChip[]
  onRemove(clear: Partial<ClassFilters>): void
  onClearAll(): void
}

/** Row of applied filter conditions; each can be removed on its own. */
export function AppliedFilters({ chips, onRemove, onClearAll }: AppliedFiltersProps) {
  if (chips.length === 0) return null
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:px-6 [&::-webkit-scrollbar]:hidden">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onRemove(chip.clear)}
          aria-label={`移除篩選：${chip.label}`}
          className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-neutral-100 pr-2 pl-3 text-xs hover:bg-neutral-200"
        >
          {chip.label}
          <X className="size-3.5" />
        </button>
      ))}
      {chips.length >= 2 && (
        <button type="button" onClick={onClearAll} className="h-7 shrink-0 px-1 text-xs text-neutral-500 underline hover:text-black">
          清除全部
        </button>
      )}
    </div>
  )
}
