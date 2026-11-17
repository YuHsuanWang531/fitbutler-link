import type { Metadata } from "next"

import { ShopView } from "@/components/shop/shop-view"
import { getTeacher } from "@/lib/member-teachers"
import { PLAN_TYPES } from "@/lib/shop-plans"

export const metadata: Metadata = { title: "購買" }

type Props = { searchParams: Promise<{ type?: string; teacher?: string }> }

/**
 * 購買列表. `?type=train|classes|private|data|point` opens on that 方案類型 tab; anything else is 全部.
 * `?teacher=` (from 老師介紹's 購買私教課) narrows the 私教課 tab to that teacher's plans; ignored on other tabs.
 */
export default async function MemberShopPage({ searchParams }: Props) {
  const { type: slug, teacher: teacherId } = await searchParams
  const type = PLAN_TYPES.find((t) => t.slug === slug)?.type ?? null
  const found = type === "私教課" && teacherId ? getTeacher(teacherId) : undefined
  const teacher = found ? { id: found.id, name: found.name } : null
  // Keyed so switching tabs (or dropping the teacher) starts the 購買類型 row back at 全部.
  return <ShopView key={`${type ?? "all"}-${teacher?.id ?? ""}`} type={type} teacher={teacher} />
}
