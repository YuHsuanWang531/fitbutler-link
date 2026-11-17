"use client"

import { setLoggedIn, useLoggedIn } from "@/lib/auth"

/** Fake 登入／登出 at the far right of the plan page's header, to flip between the 登入前 and 登入後 states. */
export function AuthToggle() {
  const loggedIn = useLoggedIn()
  return (
    <button
      type="button"
      onClick={() => setLoggedIn(!loggedIn)}
      className="flex h-8 shrink-0 items-center rounded-[10px] border border-neutral-200 px-3 text-sm text-black hover:bg-neutral-100"
    >
      {loggedIn ? "登出" : "登入"}
    </button>
  )
}
