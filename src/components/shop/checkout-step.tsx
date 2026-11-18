"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { CreditCardField } from "@/components/shop/credit-card-field"
import { OrderSummary, type OrderQuery } from "@/components/shop/order-summary"
import { Field } from "@/components/shop/plan-checkout"
import { dropUnsavedCards } from "@/lib/credit-cards"
import { clearPlanDraft, getPlanDraft, savePlanDraft } from "@/lib/plan-draft"
import { formatMoney, getPaymentOptions, paymentTotal, type PlanDetail } from "@/lib/shop-plan-detail"
import type { Plan } from "@/lib/shop-plans"

/**
 * 下一步 after the plan page's 結帳: the order so far, then 合約簽署 (plans that need a contract) and 信用卡資訊
 * (一次付清／定期定額). 確認付款 checks both and goes to 付款頁. Signing goes through 合約文件資料補件 → 合約 and
 * comes back here; the plan draft keeps what's signed and picked.
 */
export function CheckoutStep({ plan, detail, query }: { plan: Plan; detail: PlanDetail; query: OrderQuery }) {
  const router = useRouter()
  const payment = getPaymentOptions(plan, detail).find((o) => o.id === query.pay) ?? null
  const needsContract = detail.kind === "general" && detail.contract
  const needsCard = payment?.method === "card"

  const [draft] = useState(() => getPlanDraft(plan.id))
  const signed = draft?.signed ?? false
  const [cardId, setCardId] = useState<string | null>(draft?.cardId ?? null)
  const [alert, setAlert] = useState<string | null>(null)

  // Keep the picked card (and, after a reload, start a draft so signing the 合約 has somewhere to land).
  useEffect(() => {
    const current = getPlanDraft(plan.id)
    savePlanDraft(plan.id, {
      paymentId: query.pay ?? null,
      date: query.date ?? null,
      venues: query.venues?.split(",") ?? [],
      teacherId: query.teacher ?? "",
      signed: false,
      ...current,
      cardId,
    })
  }, [plan.id, query, cardId])

  const confirm = () => {
    if (needsContract && !signed) return setAlert("請先簽署合約")
    if (needsCard && !cardId) return setAlert("請選擇信用卡")
    const next = new URLSearchParams(Object.entries(query).filter((e): e is [string, string] => !!e[1]))
    if (needsCard && cardId) next.set("card", cardId)
    clearPlanDraft(plan.id)
    dropUnsavedCards()
    router.push(`/shop/${plan.id}/payment?${next}`)
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-sm leading-5 text-neutral-500">請先回到方案頁選擇付款方式</p>
        <Link
          href={`/shop/${plan.id}`}
          className="flex h-11 w-48 items-center justify-center rounded-[10px] border border-neutral-200 text-sm font-medium hover:bg-neutral-50"
        >
          回到方案頁
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-61px-env(safe-area-inset-top))] flex-col md:min-h-full">
      <div className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8 lg:px-6">
        <Field label="訂單資訊" id="checkout-order" group required={false}>
          <OrderSummary plan={plan} query={query} />
        </Field>

        {needsContract && (
          <Field label="合約簽署" id="checkout-contract" group>
            {signed ? (
              <div className="flex h-11 items-center justify-between rounded-[10px] border border-neutral-200 px-4 text-sm">
                <span className="flex items-center gap-2">
                  <Check aria-hidden className="size-4" strokeWidth={2} />
                  已簽署合約
                </span>
                <Link
                  href={`/shop/${plan.id}/contract`}
                  className="text-sm text-neutral-500 underline underline-offset-[3px]"
                >
                  查看
                </Link>
              </div>
            ) : (
              <Link
                href={`/shop/${plan.id}/contract/info`}
                className="flex h-11 items-center justify-center rounded-[10px] border border-neutral-200 text-sm font-medium text-black hover:bg-neutral-50"
              >
                簽署合約
              </Link>
            )}
          </Field>
        )}

        {needsCard && (
          <Field label="信用卡資訊" id="plan-card" group>
            <CreditCardField value={cardId} onChange={setCardId} />
          </Field>
        )}
      </div>

      <div className="sticky bottom-0 z-10 flex items-center gap-4 border-t border-neutral-200 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:pb-3 lg:px-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs leading-4 text-neutral-500">總計</span>
          <span className="text-xl leading-7 font-semibold">{formatMoney(paymentTotal(payment))}</span>
        </div>
        <Button className="h-11 w-48 rounded-[10px] text-sm" onClick={confirm}>
          確認付款
        </Button>
      </div>

      <Dialog open={alert !== null} onOpenChange={(open) => !open && setAlert(null)}>
        <DialogContent showCloseButton={false} className="gap-4 p-5 sm:max-w-xs">
          <DialogTitle className="text-center text-base font-medium">{alert}</DialogTitle>
          <DialogFooter className="m-0 border-0 bg-white p-0">
            <Button className="h-10 w-full rounded-[10px]" onClick={() => setAlert(null)}>
              確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
