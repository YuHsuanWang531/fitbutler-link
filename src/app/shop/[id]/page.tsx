import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { PlanCheckout } from "@/components/shop/plan-checkout"
import { plans } from "@/lib/shop-plans"
import { getPlan, getPlanDetail } from "@/lib/shop-plan-detail"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plan = getPlan((await params).id)
  return { title: plan ? `${plan.title}｜方案內容` : "方案內容" }
}

/** 方案內容: opened from a 購買 card's 購買 button. */
export default async function PlanPage({ params }: Props) {
  const plan = getPlan((await params).id)
  if (!plan) notFound()
  return (
    <>
      <MemberPageHeader title="方案內容" fallbackHref="/shop" />
      <MemberMain className="md:pb-0">
        <PlanCheckout plan={plan} detail={getPlanDetail(plan)} />
      </MemberMain>
    </>
  )
}
