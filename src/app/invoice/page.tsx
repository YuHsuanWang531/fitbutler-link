import type { Metadata } from "next"

import { InvoiceForm } from "@/components/shop/invoice-form"

export const metadata: Metadata = { title: "發票開立方式" }

type Props = { searchParams: Promise<{ next?: string }> }

/** 發票開立方式, opened from a plan page's 發票類型 link (`?next=` = where to return when there's no history). */
export default async function InvoicePage({ searchParams }: Props) {
  const { next } = await searchParams
  // Only in-app paths, so the link can't bounce anywhere else.
  const fallbackHref = next?.startsWith("/") && !next.startsWith("//") ? next : "/shop"
  return <InvoiceForm fallbackHref={fallbackHref} />
}
