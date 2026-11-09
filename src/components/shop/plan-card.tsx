import Link from "next/link"

import { formatPrice, type Plan } from "@/lib/shop-plans"

/**
 * 方案資訊卡片: type · subtype, title, description, price (with unit or struck original) and the gift / limit note.
 * In the 購買 list it carries a 購買 link to the plan page; on the plan page itself it's information only.
 */
export function PlanCard({ plan, buyHref }: { plan: Plan; buyHref?: string }) {
  return (
    <article className="flex flex-col rounded-[14px] border border-neutral-200 p-4">
      <p className="text-xs leading-4 text-neutral-500">
        {plan.type} · {plan.subtype}
      </p>
      <h2 className="mt-1.5 text-base leading-6 font-medium text-black">{plan.title}</h2>
      <p className="mt-0.5 text-sm leading-5 text-neutral-500">{plan.description}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="flex items-baseline gap-2">
            <span className="text-2xl leading-8 font-semibold text-black">{formatPrice(plan.price)}</span>
            {plan.unit && <span className="text-sm text-neutral-500">/ {plan.unit}</span>}
            {plan.originalPrice && (
              <s className="text-sm text-neutral-400">
                <span className="sr-only">原價</span>
                {formatPrice(plan.originalPrice)}
              </s>
            )}
          </p>
          {plan.note && <p className="text-sm leading-5 text-[#c2410c]">{plan.note}</p>}
        </div>
        {buyHref && (
          <Link
            href={buyHref}
            className="mb-0.5 flex h-9 shrink-0 items-center self-start rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            購買
          </Link>
        )}
      </div>
    </article>
  )
}
