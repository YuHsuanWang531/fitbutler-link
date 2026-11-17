import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContractSignButton } from "@/components/shop/contract-sign"
import { PlaceholderPage } from "@/components/shop/placeholder-page"
import { getPlan } from "@/lib/shop-plan-detail"

export const metadata: Metadata = { title: "合約" }

type Props = { params: Promise<{ id: string }> }

/** 合約 (placeholder): opened from the plan page's 簽署合約; 同意並簽署 goes back to the plan page as signed. */
export default async function ContractPage({ params }: Props) {
  const { id } = await params
  const plan = getPlan(id)
  if (!plan) notFound()
  return (
    <PlaceholderPage title="合約" fallbackHref={`/shop/${id}`}>
      <p className="text-base leading-6 font-medium">{plan.title}</p>
      <ContractSignButton planId={id} />
    </PlaceholderPage>
  )
}
