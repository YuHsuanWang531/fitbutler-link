import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { OrderSummary, type OrderQuery } from "@/components/shop/order-summary"
import { PlaceholderPage } from "@/components/shop/placeholder-page"
import { getPlan } from "@/lib/shop-plan-detail"

export const metadata: Metadata = { title: "合約" }

type Props = { params: Promise<{ id: string }>; searchParams: Promise<OrderQuery> }

/** 6.3 合約 (placeholder): plans that need a contract land here from 結帳, then continue to 付款. */
export default async function ContractPage({ params, searchParams }: Props) {
  const { id } = await params
  const plan = getPlan(id)
  if (!plan) notFound()
  const query = await searchParams
  const next = new URLSearchParams(Object.entries(query).filter((e): e is [string, string] => !!e[1]))
  return (
    <PlaceholderPage title="合約" fallbackHref={`/shop/${id}`}>
      <OrderSummary plan={plan} query={query} />
      <Link
        href={`/shop/${id}/payment?${next}`}
        className="flex h-11 items-center justify-center rounded-[10px] bg-black text-base font-medium text-white hover:bg-neutral-800"
      >
        同意並前往付款
      </Link>
    </PlaceholderPage>
  )
}
