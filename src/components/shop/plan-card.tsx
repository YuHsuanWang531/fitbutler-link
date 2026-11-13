import Link from "next/link"

import { cn } from "@/lib/utils"

import { giftLabel, priceHint, priceLabel, scarcityLabel, type Plan } from "@/lib/shop-plans"

/**
 * 方案卡片: 購買類型 tags, 方案名稱, 搶購文案, 金額 (+ 輔助說明 for 定期定額／訂閱制) and 加贈項目. In the 購買
 * list the whole card links to the plan page (查看 is just its visible cue); on the plan page it's information only.
 */
export function PlanCard({ plan, href }: { plan: Plan; href?: string }) {
  const scarcity = scarcityLabel(plan)
  const hint = priceHint(plan)
  const gift = giftLabel(plan)
  const card = (
    <article
      className={cn(
        "flex flex-col rounded-[10px] border border-neutral-200 p-4",
        href && "transition-colors group-hover:border-neutral-300 group-hover:bg-neutral-50"
      )}
    >
      {plan.buyTypes.length > 0 && (
        <ul aria-label="購買類型" className="mb-2 flex flex-wrap gap-1.5">
          {plan.buyTypes.map((t) => (
            <li key={t} className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs leading-4 text-neutral-700">
              {t}
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-base leading-6 font-medium text-black">{plan.title}</h2>
      {scarcity && <p className="mt-0.5 text-sm leading-5 text-[#c2410c]">{scarcity}</p>}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-2xl leading-8 font-semibold text-black">{priceLabel(plan)}</p>
          {hint && <p className="text-sm leading-5 text-neutral-500">{hint}</p>}
          {gift && <p className="text-sm leading-5 text-[#c2410c]">{gift}</p>}
        </div>
        {href && (
          <span
            aria-hidden
            className="flex h-9 shrink-0 items-center self-start rounded-[8px] bg-black px-5 text-sm font-medium text-white group-hover:bg-neutral-800"
          >
            查看
          </span>
        )}
      </div>
    </article>
  )
  return href ? (
    <Link href={href} className="group block rounded-[10px]">
      {card}
    </Link>
  ) : (
    card
  )
}
