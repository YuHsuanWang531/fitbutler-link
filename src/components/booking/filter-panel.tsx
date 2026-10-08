"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { matchesFilters } from "@/lib/booking/classes"
import { NO_FILTERS, type ClassCategory, type ClassFilters, type GymClass, type Teacher } from "@/lib/booking/types"

type FilterPanelProps = {
  open: boolean
  onOpenChange(open: boolean): void
  applied: ClassFilters
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

function FilterForm({ applied, categories, teachers, rangeClasses, onApply, Header, Title, Footer }: FilterFormProps) {
  const [draft, setDraft] = useState(applied)
  const count = rangeClasses.filter((c) => matchesFilters(c, draft)).length

  return (
    <>
      <Header className="px-4 pt-4 pb-2">
        <Title className="text-base font-medium">篩選課程</Title>
      </Header>
      <div className="flex flex-col gap-5 px-4 py-2">
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
                selected ? "border-black bg-black text-white" : "border-neutral-200 text-black"
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
