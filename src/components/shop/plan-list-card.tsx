import Link from "next/link"
import { ChevronRight, Gift } from "lucide-react"

import { cn } from "@/lib/utils"
import { planInfoTags, priceHint, priceLabel, type Plan } from "@/lib/shop-plans"

/**
 * 方案資訊卡片 (緊湊列表樣式): the whole card opens the plan page, with › on the right. 方案類型 (`showType`, the 全部
 * tab only) and 購買類型 tags, 方案名稱
 * (2 lines max), 金額 + 輔助說明 and 資訊標籤 (剩餘／限購／加贈). 金額 sits on the right, centered on the card.
 */
export function PlanListCard({ plan, href, showType }: { plan: Plan; href: string; showType?: boolean }) {
  const buyTypes = plan.type === "儲值金" ? [] : plan.buyTypes
  const hint = priceHint(plan)
  const tags = planInfoTags(plan)
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-[10px] border border-neutral-200 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {(showType || buyTypes.length > 0) && (
          <ul aria-label="方案分類" className="mb-2 flex flex-wrap gap-1.5">
            {showType && (
              // 方案類型, only under 全部; 儲值金 reads 儲值 here.
              <li className="rounded bg-black px-1.5 py-0.5 text-xs leading-4 text-white">
                {plan.type === "儲值金" ? "儲值" : plan.type}
              </li>
            )}
            {buyTypes.map((t) => (
              <li key={t} className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs leading-4 text-neutral-700">
                {t}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-1">
          <h2 className="line-clamp-2 text-base leading-6 font-medium text-black">{plan.title}</h2>
          {hint && <p className="truncate text-sm leading-5 text-muted-foreground">{hint}</p>}
        </div>
        {tags.length > 0 && (
          <ul aria-label="方案資訊" className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag.kind}
                className={cn(
                  "flex h-6 items-center gap-1 rounded-full border px-2.5 text-sm",
                  tag.kind === "stock"
                    ? "border-[#f3c2ad] bg-[#fdf1ec] text-[#c2410c]"
                    : "border-neutral-200 bg-white text-neutral-800"
                )}
              >
                {tag.kind === "gift" && <Gift aria-hidden className="size-3.5" strokeWidth={2} />}
                {tag.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="shrink-0 text-xl leading-7 font-semibold text-black">{priceLabel(plan)}</p>
      <ChevronRight aria-hidden className="size-5 shrink-0 text-neutral-500" strokeWidth={2} />
    </Link>
  )
}
