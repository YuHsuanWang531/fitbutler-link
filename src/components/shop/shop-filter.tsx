"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SHOP_VENUES, SORTS } from "@/lib/shop-plans"
import {
  CLEARED_SHOP_FILTERS,
  countShopFilters,
  setShopFilters,
  useShopFilters,
  type ShopFilters,
} from "@/lib/shop-filters"

/**
 * The 購買 header's 篩選 button, styled like 預約's: 場館 (單選, with 全部) and 排序 chips, 清除 + 套用, and a
 * count badge. Bottom sheet on phones, dialog from md up.
 */
export function ShopFilter() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const filters = useShopFilters()
  const count = countShopFilters(filters)

  const form = (Header: typeof SheetHeader, Title: typeof SheetTitle, Footer: typeof SheetFooter) => (
    <FilterForm
      applied={filters}
      onApply={(next) => {
        setShopFilters(next)
        setOpen(false)
      }}
      Header={Header}
      Title={Title}
      Footer={Footer}
    />
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={count ? `篩選，已套用 ${count} 個條件` : "篩選"}
        className="relative"
      >
        <SlidersHorizontal className="size-6 md:size-7" strokeWidth={1.5} />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-black text-[10px] leading-none text-white">
            {count}
          </span>
        )}
      </button>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="flex max-h-[85dvh] flex-col gap-0 p-0 sm:max-w-md">
            {form(DialogHeader, DialogTitle, DialogFooter)}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="max-h-[85dvh] gap-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
            {form(SheetHeader, SheetTitle, SheetFooter)}
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

type FilterFormProps = {
  applied: ShopFilters
  onApply(filters: ShopFilters): void
  Header: typeof SheetHeader
  Title: typeof SheetTitle
  Footer: typeof SheetFooter
}

function FilterForm({ applied, onApply, Header, Title, Footer }: FilterFormProps) {
  const [draft, setDraft] = useState(applied)
  return (
    <>
      <Header className="px-4 pt-4 pb-2">
        <Title className="text-base font-medium">篩選方案</Title>
      </Header>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-2">
        <ChipGroup
          label="場館"
          options={[{ value: null, label: "全部" }, ...SHOP_VENUES.map((v) => ({ value: v.name, label: v.name }))]}
          value={draft.venue}
          onChange={(venue) => setDraft((d) => ({ ...d, venue }))}
        />
        <ChipGroup
          label="排序"
          options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
          value={draft.sort}
          onChange={(sort) => sort && setDraft((d) => ({ ...d, sort }))}
        />
      </div>
      <Footer className="m-0 flex-row gap-2 border-t border-neutral-200 bg-white px-4 pt-3 pb-4">
        <Button variant="ghost" className="h-10 px-4" onClick={() => setDraft(CLEARED_SHOP_FILTERS)}>
          清除
        </Button>
        <Button className="h-10 flex-1 rounded-full" onClick={() => onApply(draft)}>
          套用
        </Button>
      </Footer>
    </>
  )
}

/** Single-choice chips, same look as the 預約 filter's. */
function ChipGroup<T extends string | null>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange(value: T): void
}) {
  return (
    <div>
      <p id={`shop-filter-${label}`} className="mb-2 text-sm font-medium">
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
                "flex h-8 items-center rounded-full border px-3.5 text-sm",
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
