"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { OptionGroup } from "@/components/booking/filter-panel"
import { planInVenues, plans, SHOP_VENUES } from "@/lib/shop-plans"
import { setShopVenues, useShopVenues } from "@/lib/shop-venue"

/**
 * The 購買 header's 篩選 button, working like 預約's: 場館 chips with 全部, 清除 + 顯示 N 個方案, and a count badge.
 * Bottom sheet on phones, dialog from md up.
 */
export function ShopVenueFilter() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const venues = useShopVenues()
  const count = Number(venues.length > 0)

  const form = (Header: typeof SheetHeader, Title: typeof SheetTitle, Footer: typeof SheetFooter) => (
    <VenueForm
      applied={venues}
      onApply={(next) => {
        setShopVenues(next)
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

type VenueFormProps = {
  applied: string[]
  onApply(venues: string[]): void
  Header: typeof SheetHeader
  Title: typeof SheetTitle
  Footer: typeof SheetFooter
}

function VenueForm({ applied, onApply, Header, Title, Footer }: VenueFormProps) {
  const [draft, setDraft] = useState(applied)
  const count = plans.filter((p) => planInVenues(p, draft)).length
  return (
    <>
      <Header className="px-4 pt-4 pb-2">
        <Title className="text-base font-medium">篩選方案</Title>
      </Header>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-2">
        <OptionGroup
          label="場館"
          options={SHOP_VENUES.map((v) => ({ value: v, label: v }))}
          value={draft}
          onChange={setDraft}
        />
      </div>
      <Footer className="m-0 flex-row gap-2 border-t border-neutral-200 bg-white px-4 pt-3 pb-4">
        <Button variant="ghost" className="h-10 px-4" onClick={() => setDraft([])}>
          清除
        </Button>
        <Button className="h-10 flex-1 rounded-full" disabled={count === 0} onClick={() => onApply(draft)}>
          顯示 {count} 個方案
        </Button>
      </Footer>
    </>
  )
}
