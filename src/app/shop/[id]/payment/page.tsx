import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OrderSummary, type OrderQuery } from "@/components/shop/order-summary"
import { PlaceholderPage } from "@/components/shop/placeholder-page"
import { getPlan } from "@/lib/shop-plan-detail"

export const metadata: Metadata = { title: "付款" }

type Props = { params: Promise<{ id: string }>; searchParams: Promise<OrderQuery> }

/** 6.4 付款頁面 (placeholder). */
export default async function PaymentPage({ params, searchParams }: Props) {
  const { id } = await params
  const plan = getPlan(id)
  if (!plan) notFound()
  return (
    <PlaceholderPage title="付款" fallbackHref={`/shop/${id}`}>
      <OrderSummary plan={plan} query={await searchParams} />
    </PlaceholderPage>
  )
}
