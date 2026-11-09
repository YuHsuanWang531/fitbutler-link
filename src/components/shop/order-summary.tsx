import { getPaymentOptions, getPlanDetail, formatMoney, paymentTotal } from "@/lib/shop-plan-detail"
import type { Plan } from "@/lib/shop-plans"

export type OrderQuery = { pay?: string; date?: string; venues?: string }

/** What the plan page carried over (方案、付款方式與明細、啟用日、場館), shown on the 合約 / 付款 placeholders. */
export function OrderSummary({ plan, query }: { plan: Plan; query: OrderQuery }) {
  const payment = getPaymentOptions(plan, getPlanDetail(plan)).find((o) => o.id === query.pay)
  return (
    <dl className="flex flex-col gap-2 rounded-[14px] border border-neutral-200 p-4 text-sm leading-5">
      <Line label="方案">{plan.title}</Line>
      {query.date && <Line label="會籍啟用日">{query.date.replaceAll("-", "/")}</Line>}
      {query.venues && <Line label="可使用場館">{query.venues.split(",").join("、")}</Line>}
      {payment && (
        <>
          <Line label="付款方式">{payment.label}</Line>
          {payment.lines.map((l) => (
            <Line key={l.label} label={l.label}>
              {formatMoney(l.amount)}
            </Line>
          ))}
          {payment.discounts.map((l) => (
            <Line key={l.label} label={l.label}>
              −{formatMoney(l.amount)}
            </Line>
          ))}
          <div className="mt-1 flex justify-between border-t border-neutral-100 pt-2 text-base font-medium">
            <dt>總計</dt>
            <dd>{formatMoney(paymentTotal(payment))}</dd>
          </div>
        </>
      )}
    </dl>
  )
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-neutral-500">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}
