"use client"


import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownSelect } from "@/components/ui/dropdown-select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

/** Bottom sheet on phones, dialog from md up (same as 預約's popups). */
export function Popup({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  title: string
  children?: React.ReactNode
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col gap-0 p-0 sm:max-w-[500px]">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-base font-medium">{title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] gap-0 rounded-t-[10px] pb-[env(safe-area-inset-bottom)]">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle className="text-base font-medium">{title}</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

/**
 * 場館: a pill next to the page title (購買, 預約) showing the picked venue, or 全部場館; tapping it drops a list of
 * the venues 4px below (✓ on the picked one). Picking one applies it right away.
 */
export function VenuePill({
  venues,
  value,
  onChange,
}: {
  venues: string[]
  value: string | null
  onChange(venue: string | null): void
}) {
  return (
    <DropdownSelect
      size="pill"
      label="場館"
      options={[{ value: "", label: "全部場館" }, ...venues.map((v) => ({ value: v, label: v }))]}
      value={value ?? ""}
      onChange={(next) => onChange(next || null)}
    />
  )
}

/** Single-choice chips, same look as the 預約 filter's. */
export function ChipGroup<T extends string | null>({
  label,
  options,
  value,
  onChange,
  hideLabel,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T | null
  onChange(value: T): void
  /** Visually hidden when the popup title already says it. */
  hideLabel?: boolean
}) {
  return (
    <div>
      <p id={`shop-filter-${label}`} className={hideLabel ? "sr-only" : "mb-2 text-sm font-medium"}>
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={`shop-filter-${label}`} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value ?? "all"}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex h-8 items-center rounded-[10px] border px-3.5 text-sm",
                selected ? "border-black bg-black text-white" : "border-neutral-200 text-black hover:bg-neutral-100"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
