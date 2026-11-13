"use client"

import { useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { PlanListCard } from "@/components/shop/plan-list-card"
import { useShopFilters, useShopSort } from "@/lib/shop-filters"
import {
  BUY_TYPES,
  isOnSale,
  PLAN_TYPES,
  planInVenue,
  plans,
  sortPlans,
  type BuyType,
  type PlanType,
} from "@/lib/shop-plans"

const TABS: { type: PlanType | null; label: string; href: string }[] = [
  { type: null, label: "全部", href: "/shop" },
  ...PLAN_TYPES.map(({ type, slug }) => ({ type, label: type, href: `/shop?type=${slug}` })),
]

/**
 * 購買列表: 方案類型 tabs (`?type=`), a 購買類型 chip row (not on 全部／儲值金), and plans that are on sale, sold at
 * the picked 場館 and ordered by the picked 排序 (場館 and 排序 both come from the header).
 */
export function ShopView({ type }: { type: PlanType | null }) {
  const { venue } = useShopFilters()
  const sort = useShopSort()
  const [buyType, setBuyType] = useState<BuyType | null>(null)

  const inTab = plans.filter((p) => isOnSale(p) && (!type || p.type === type))
  // A 購買類型 only shows when the tab has plans of it (before the venue filter, so the row doesn't shift).
  const buyTypes = type && type !== "儲值金" ? BUY_TYPES.filter((t) => inTab.some((p) => p.buyTypes.includes(t))) : []
  const list = sortPlans(
    inTab.filter((p) => planInVenue(p, venue) && (!buyType || p.buyTypes.includes(buyType))),
    sort
  )

  return (
    <div className="[--shop-top:calc(61px+env(safe-area-inset-top))] md:[--shop-top:0px]">
      <div className="sticky top-(--shop-top) z-10 bg-white">
        <nav
          aria-label="方案類型"
          className="flex gap-6 overflow-x-auto border-b border-neutral-200 px-6 [scrollbar-width:none] md:px-7"
        >
          {TABS.map((tab) => {
            const selected = tab.type === type
            return (
              <Link
                key={tab.label}
                href={tab.href}
                replace
                scroll={false}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "relative flex h-12 shrink-0 items-center text-base",
                  selected ? "font-medium text-black" : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                {tab.label}
                {selected && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-black" />}
              </Link>
            )
          })}
        </nav>
        {buyTypes.length > 0 && (
          <div
            role="radiogroup"
            aria-label="購買類型"
            className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-7"
          >
            {[null, ...buyTypes].map((t) => {
              const selected = t === buyType
              return (
                <button
                  key={t ?? "all"}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setBuyType(t)}
                  className={cn(
                    "h-8 shrink-0 rounded-[10px] border px-3.5 text-sm",
                    selected ? "border-black bg-black text-white" : "border-neutral-200 text-black hover:bg-neutral-100"
                  )}
                >
                  {t ?? "全部"}
                </button>
              )
            })}
          </div>
        )}
      </div>
      {list.length > 0 ? (
        <ul className={cn("flex flex-col gap-3 px-4 pb-6 md:px-7", buyTypes.length > 0 ? "pt-0" : "pt-4")}>
          {list.map((plan) => (
            <li key={plan.id}>
              <PlanListCard plan={plan} href={`/shop/${plan.id}`} showType={!type} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-16 text-center text-sm text-neutral-500">目前暫無方案</p>
      )}
    </div>
  )
}
