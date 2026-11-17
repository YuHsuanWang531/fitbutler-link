import type { Metadata } from "next"

import { MockLoginButton } from "@/components/member/mock-login-button"
import { PlaceholderPage } from "@/components/shop/placeholder-page"

export const metadata: Metadata = { title: "登入／註冊" }

type Props = { searchParams: Promise<{ next?: string }> }

/** 登入／註冊 (placeholder). 登入購買 sends signed-out members here with `?next=` to return to afterwards. */
export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams
  // Only in-app paths, so the link can't bounce anywhere else.
  const back = next?.startsWith("/") && !next.startsWith("//") ? next : "/"
  return (
    <PlaceholderPage title="登入／註冊" fallbackHref={back}>
      <MockLoginButton next={back} />
    </PlaceholderPage>
  )
}
