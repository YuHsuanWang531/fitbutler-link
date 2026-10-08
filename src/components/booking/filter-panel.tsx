"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { matchesFilters, TIME_FILTER_OPTIONS } from "@/lib/booking/classes"
import { NO_FILTERS, type ClassCategory, type ClassFilters, type GymClass, type Teacher } from "@/lib/booking/types"

type FilterPanelProps = {
  open: boolean
  onOpenChange(open: boolean): void
  applied: ClassFilters
  venues: string[]
  categories: ClassCategory[]
  teachers: Teacher[]
  /** Classes in the current month (or week), used for the 「顯示 N 堂課」 count. */
  rangeClasses: GymClass[]
  onApply(filters: ClassFilters): void
}

/** Bottom sheet on phones, centred dialog from md up. */
export function FilterPanel({ open, onOpenChange, ...formProps }: FilterPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  // The popup unmounts when closed, so the form starts from the applied filters every time it opens.
  const form = (Header: typeof SheetHeader, Title: typeof SheetTitle, Footer: typeof SheetFooter) => (
    <FilterForm {...formProps} Header={Header} Title={Title} Footer={Footer} />
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 p-0 sm:max-w-md">{form(DialogHeader, DialogTitle, DialogFooter)}</DialogContent>
      </Dialog>
    )
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
        {form(SheetHeader, SheetTitle, SheetFooter)}
      </SheetContent>
    </Sheet>
  )
}

type FilterFormProps = Omit<FilterPanelProps, "open" | "onOpenChange"> & {
  Header: typeof SheetHeader
  Title: typeof SheetTitle
  Footer: typeof SheetFooter
}

function FilterForm({ applied, venues, categories, teachers, rangeClasses, onApply, Header, Title, Footer }: FilterFormProps) {
  const [draft, setDraft] = useState(applied)
  const count = rangeClasses.filter((c) => matchesFilters(c, draft)).length

  return (
    <>
      <Header className="px-4 pt-4 pb-2">
        <Title className="text-base font-medium">篩選課程</Title>
      </Header>
      <div className="flex flex-col gap-5 px-4 py-2">
        <OptionGroup
          label="上課場館"
          options={venues.map((v) => ({ value: v, label: v }))}
          value={draft.venue}
          onChange={(venue) => setDraft((d) => ({ ...d, venue }))}
        />
        <OptionGroup
          label="課程類別"
          options={categories.map((c) => ({ value: c, label: c }))}
          value={draft.category}
          onChange={(category) => setDraft((d) => ({ ...d, category: category as ClassCategory | null }))}
        />
        <OptionGroup
          label="授課老師"
          options={teachers.map((t) => ({ value: t.id, label: t.name }))}
          value={draft.teacherId}
          onChange={(teacherId) => setDraft((d) => ({ ...d, teacherId }))}
        />
        <TimeRange
          from={draft.timeFrom}
          to={draft.timeTo}
          onChange={(timeFrom, timeTo) => setDraft((d) => ({ ...d, timeFrom, timeTo }))}
        />
      </div>
      <Footer className="flex-row gap-2 px-4 pt-4 pb-4">
        <Button variant="ghost" className="h-10 px-4" onClick={() => setDraft(NO_FILTERS)}>
          清除
        </Button>
        <Button className="h-10 flex-1 rounded-full" disabled={count === 0} onClick={() => onApply(draft)}>
          顯示 {count} 堂課
        </Button>
      </Footer>
    </>
  )
}

type OptionGroupProps = {
  label: string
  options: { value: string; label: string }[]
  value: string | null
  onChange(value: string | null): void
}

/** Single choice with a leading 「全部」 option (`null`). */
function OptionGroup({ label, options, value, onChange }: OptionGroupProps) {
  const all = [{ value: null, label: "全部" }, ...options]
  return (
    <div>
      <p id={`filter-${label}`} className="mb-2 text-sm font-medium">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={`filter-${label}`} className="flex flex-wrap gap-2">
        {all.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value ?? "all"}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-8 rounded-full border px-3.5 text-sm",
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

type TimeRangeProps = {
  from: string | null
  to: string | null
  onChange(from: string | null, to: string | null): void
}

/**
 * 上課時間: classes starting between two half-hour marks; either end can stay 不限.
 * Picking a start at or after the end (or vice versa) clears the other end instead of leaving an empty range.
 */
function TimeRange({ from, to, onChange }: TimeRangeProps) {
  return (
    <div>
      <p id="filter-time" className="mb-2 text-sm font-medium">
        上課時間
      </p>
      <div role="group" aria-labelledby="filter-time" className="flex items-center gap-2">
        <TimeSelect
          label="開始時間"
          value={from}
          options={TIME_FILTER_OPTIONS.slice(0, -1)}
          onChange={(next) => onChange(next, next && to && to <= next ? null : to)}
        />
        <span aria-hidden className="text-sm text-muted-foreground">
          –
        </span>
        <TimeSelect
          label="結束時間"
          value={to}
          options={TIME_FILTER_OPTIONS.slice(1)}
          onChange={(next) => onChange(next && from && from >= next ? null : from, next)}
        />
      </div>
    </div>
  )
}

type TimeSelectProps = {
  label: string
  value: string | null
  options: string[]
  onChange(value: string | null): void
}

/** Native select (the phone's own picker), styled like the option chips. */
function TimeSelect({ label, value, options, onChange }: TimeSelectProps) {
  return (
    <div className="relative flex-1">
      <select
        aria-label={label}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={cn(
          "h-10 w-full cursor-pointer appearance-none rounded-full border bg-white pr-9 pl-4 text-sm hover:bg-neutral-100",
          value ? "border-black" : "border-neutral-200 text-muted-foreground"
        )}
      >
        <option value="">不限</option>
        {options.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-neutral-500"
      />
    </div>
  )
}
