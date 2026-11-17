"use client"

import { useRouter } from "next/navigation"

import { canGoBackInApp, markBack, markReplace } from "@/components/member/nav-depth"
import { markContractSigned } from "@/lib/plan-draft"

/** 同意並簽署: marks the plan's 合約 as signed and returns to the plan page. */
export function ContractSignButton({ planId }: { planId: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => {
        markContractSigned(planId)
        // Back to the plan page it came from, so the history doesn't hold the plan page twice.
        if (canGoBackInApp()) {
          markBack()
          router.back()
        } else {
          markReplace()
          router.replace(`/shop/${planId}`)
        }
      }}
      className="flex h-11 items-center justify-center rounded-[10px] bg-black text-sm font-medium text-white hover:bg-neutral-800"
    >
      同意並簽署
    </button>
  )
}
