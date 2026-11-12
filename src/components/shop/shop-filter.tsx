"use client"

import { useState } from "react"
import { ArrowUpDown } from "lucide-react"

import { ChipGroup, Popup, VenuePill } from "@/components/member/venue-pill"
import { SHOP_VENUES, SORTS } from "@/lib/shop-plans"
import { setShopFilters, setShopSort, useShopFilters, useShopSort } from "@/lib/shop-filters"

/** 購買's 場館 pill (single choice, with 全部場館). */
export function ShopVenuePicker() {
  const { venue } = useShopFilters()
  return (
    <VenuePill
      venues={SHOP_VENUES.map((v) => v.name)}
      value={venue}
      onChange={(next) => setShopFilters({ venue: next })}
    />
  )
}

/**
 * 排序: 最新上架／價格低到高／價格高到低, applied as soon as one is picked. None is picked at first (tap the
 * picked one to clear); a dot shows once one is.
 */
export function ShopSort() {
  const [open, setOpen] = useState(false)
  const sort = useShopSort()
  const label = SORTS.find((s) => s.key === sort)?.label ?? "未選擇"
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`排序：${label}`} className="relative">
        <ArrowUpDown className="size-6 md:size-7" strokeWidth={1.5} />
        {sort && (
          <span aria-hidden className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-black ring-2 ring-white" />
        )}
      </button>
      <Popup open={open} onOpenChange={setOpen} title="排序">
        <ChipGroup
          label="排序方式"
          hideLabel
          options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
          value={sort}
          onChange={(next) => {
            setShopSort(next === sort ? null : next)
            setOpen(false)
          }}
        />
      </Popup>
    </>
  )
}
