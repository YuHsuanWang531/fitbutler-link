// What the member has filled in on a plan page, kept while they step out to sign the 合約 and come back.
// In memory only: a reload starts the plan page over.

import type { InvoiceDraft } from "@/components/shop/invoice-form"

export type PlanDraft = {
  paymentId: string | null
  date: string | null
  venues: string[]
  teacherId: string
  cardId: string | null
  invoice: InvoiceDraft
  /** 合約 signed on the contract page. */
  signed: boolean
}

const drafts = new Map<string, PlanDraft>()

export const getPlanDraft = (planId: string) => drafts.get(planId)

export function savePlanDraft(planId: string, draft: PlanDraft) {
  drafts.set(planId, draft)
}

/** The contract page's 同意並簽署. */
export function markContractSigned(planId: string) {
  const draft = drafts.get(planId)
  if (draft) drafts.set(planId, { ...draft, signed: true })
}

/** After 結帳, the next visit starts fresh. */
export function clearPlanDraft(planId: string) {
  drafts.delete(planId)
}
