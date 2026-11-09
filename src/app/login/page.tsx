import type { Metadata } from "next"

import { PlaceholderPage } from "@/components/shop/placeholder-page"

export const metadata: Metadata = { title: "登入／註冊" }

/** 登入／註冊 (placeholder). Checkout sends signed-out members here with `?next=` to return to afterwards. */
export default function LoginPage() {
  return <PlaceholderPage title="登入／註冊" />
}
