import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { ContractInfoForm } from "@/components/shop/contract-info-form"
import { getPlan } from "@/lib/shop-plan-detail"

export const metadata: Metadata = { title: "合約文件資料補件" }

type Props = { params: Promise<{ id: string }> }

/** 合約文件資料補件: the plan page's 簽署合約 opens this first; 下一步 continues to the contract. */
export default async function ContractInfoPage({ params }: Props) {
  const { id } = await params
  if (!getPlan(id)) notFound()
  return (
    <>
      <MemberPageHeader title="合約文件資料補件" fallbackHref={`/shop/${id}`} />
      <MemberMain className="md:pb-0">
        <ContractInfoForm planId={id} />
      </MemberMain>
    </>
  )
}
