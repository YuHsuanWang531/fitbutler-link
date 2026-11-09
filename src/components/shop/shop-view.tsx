"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { PlanCard } from "@/components/shop/plan-card"
import { PLAN_TYPES, planInVenues, plans, SUBTYPE_FILTER_TYPES, type PlanType } from "@/lib/shop-plans"
import { useShopVenues } from "@/lib/shop-venue"

const TABS: (PlanType | null)[] = [null, ...PLAN_TYPES]

/**
 * 購買: plan-type tabs over the filtered venues' plans (venues come from the header's 篩選). 會籍 / 團體課程 / 私人課程
 * also get a chip row of their 次分類 under the tabs.
 */
export function ShopView() {
  const venues = useShopVenues()
  const [type, setType] = useState<PlanType | null>(null)
  const [subtype, setSubtype] = useState<string | null>(null)
  const inTab = plans.filter((p) => planInVenues(p, venues) && (!type || p.type === type))
  // 次分類 come from every plan of the tab, so the chips don't shift when the venue filter changes.
  const subtypes =
    type && SUBTYPE_FILTER_TYPES.includes(type)
      ? [...new Set(plans.filter((p) => p.type === type).map((p) => p.subtype))]
      : []
  const list = subtype ? inTab.filter((p) => p.subtype === subtype) : inTab
  const selectTab = (next: PlanType | null) => {
    setType(next)
    setSubtype(null)
  }

  return (
    <div className="[--shop-top:calc(61px+env(safe-area-inset-top))] md:[--shop-top:0px]">
      <div className="sticky top-(--shop-top) z-10 bg-white">
        <div
          role="tablist"
          aria-label="方案類型"
          className={cn(
            "flex gap-6 overflow-x-auto px-6 [scrollbar-width:none] md:px-7",
            "border-b border-neutral-200"
          )}
        >
          {TABS.map((t) => {
            const selected = t === type
            return (
              <button
                key={t ?? "all"}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(t)}
                className={cn(
                  "relative h-12 shrink-0 text-base",
                  selected ? "font-medium text-black" : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                {t ?? "全部方案"}
                {selected && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-black" />}
              </button>
            )
          })}
        </div>
        {subtypes.length > 0 && (
          <div
            role="group"
            aria-label={`${type}次分類`}
            className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-7"
          >
            {[null, ...subtypes].map((s) => {
              const selected = s === subtype
              return (
                <button
                  key={s ?? "all"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSubtype(s)}
                  className={cn(
                    "h-8 shrink-0 rounded-full border px-3.5 text-sm",
                    selected ? "border-black bg-black text-white" : "border-neutral-200 text-black hover:bg-neutral-100"
                  )}
                >
                  {s ?? "全部"}
                </button>
              )
            })}
          </div>
        )}
      </div>
      {list.length > 0 ? (
        <ul className={cn("flex flex-col gap-3 px-4 pb-6 md:px-7", subtypes.length > 0 ? "pt-0" : "pt-4")}>
          {list.map((plan) => (
            <li key={plan.id}>
              <PlanCard plan={plan} buyHref={`/shop/${plan.id}`} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-16 text-center text-sm text-neutral-500">目前篩選的場館沒有這類方案</p>
      )}
    </div>
  )
}
