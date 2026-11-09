"use client"

import { useSyncExternalStore } from "react"

/** 發票開立方式, saved per device until it comes from the member's profile. */
export type InvoiceSetting =
  | { type: "member"; email: string }
  | { type: "mobile"; barcode: string }
  | { type: "company"; email: string; taxId: string; title: string }

export const INVOICE_TYPE_LABELS: Record<InvoiceSetting["type"], string> = {
  member: "會員載具",
  mobile: "手機條碼載具",
  company: "統一編號",
}

const KEY = "fitbutler:invoice"
const DEFAULT: InvoiceSetting = { type: "member", email: "" }

let cached: InvoiceSetting | null = null
const listeners = new Set<() => void>()

function read(): InvoiceSetting {
  if (cached) return cached
  try {
    const raw = localStorage.getItem(KEY)
    cached = raw ? (JSON.parse(raw) as InvoiceSetting) : DEFAULT
  } catch {
    cached = DEFAULT
  }
  return cached
}

export function saveInvoiceSetting(next: InvoiceSetting) {
  cached = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
  listeners.forEach((listener) => listener())
}

export function useInvoiceSetting() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    read,
    () => DEFAULT
  )
}

// ——— Validation ———

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+$/.test(v.trim())
/** 手機條碼載具: starts with 「/」, e.g. /ABC123. */
export const isMobileBarcode = (v: string) => /^\/[0-9A-Z.+-]+$/i.test(v.trim())
export const isTaxId = (v: string) => /^\d{8}$/.test(v.trim())

/** Mock 統一編號 → 公司抬頭 lookup used to auto-fill the title. */
const COMPANY_TITLES: Record<string, string> = {
  "12345678": "健身管家股份有限公司",
  "24536806": "範例科技股份有限公司",
}
export const lookupCompanyTitle = (taxId: string) => COMPANY_TITLES[taxId.trim()]
