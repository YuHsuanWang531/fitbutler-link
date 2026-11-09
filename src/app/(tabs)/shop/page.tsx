import type { Metadata } from "next"

import { ShopView } from "@/components/shop/shop-view"

export const metadata: Metadata = { title: "購買" }

export default function MemberShopPage() {
  return <ShopView />
}
