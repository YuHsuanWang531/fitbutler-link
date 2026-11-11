import type { Metadata } from "next"

import { ShopView } from "@/components/shop/shop-view"
import { PLAN_TYPES } from "@/lib/shop-plans"

export const metadata: Metadata = { title: "購買" }

type Props = { searchParams: Promise<{ type?: string }> }

/** 購買列表. `?type=train|classes|private|data|point` opens on that 方案類型 tab; anything else is 全部. */
export default async function MemberShopPage({ searchParams }: Props) {
  const { type: slug } = await searchParams
  const type = PLAN_TYPES.find((t) => t.slug === slug)?.type ?? null
  // Keyed so switching tabs starts the 購買類型 row back at 全部.
  return <ShopView key={type ?? "all"} type={type} />
}
