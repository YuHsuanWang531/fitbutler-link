"use client"

import { useRouter } from "next/navigation"

import { canGoBackInApp, markBack, markReplace } from "@/components/member/nav-depth"
import { setLoggedIn } from "@/lib/auth"

/** Placeholder 登入: flips the mock state to signed in and returns to `next` (the page that sent the member here). */
export function MockLoginButton({ next }: { next: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => {
        setLoggedIn(true)
        if (canGoBackInApp()) {
          markBack()
          router.back()
        } else {
          markReplace()
          router.replace(next)
        }
      }}
      className="flex h-11 items-center justify-center rounded-[10px] bg-black text-sm font-medium text-white hover:bg-neutral-800"
    >
      登入
    </button>
  )
}
