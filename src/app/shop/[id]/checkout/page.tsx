import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { CheckoutStep } from "@/components/shop/checkout-step"
import type { OrderQuery } from "@/components/shop/order-summary"
import { getPlan, getPlanDetail } from "@/lib/shop-plan-detail"

export const metadata: Metadata = { title: "確認訂單" }

type Props = { params: Promise<{ id: string }>; searchParams: Promise<OrderQuery> }

/** 下一步 after the plan page's 結帳: 合約簽署 and 信用卡資訊, then 確認付款. */
export default async function CheckoutPage({ params, searchParams }: Props) {
  const { id } = await params
  const plan = getPlan(id)
  if (!plan) notFound()
  return (
    <>
      <MemberPageHeader title="確認訂單" fallbackHref={`/shop/${id}`} />
      <MemberMain className="md:pb-0">
        <CheckoutStep plan={plan} detail={getPlanDetail(plan)} query={await searchParams} />
      </MemberMain>
    </>
  )
}
