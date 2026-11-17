"use client"

import { useSyncExternalStore } from "react"

/** A saved card: only what the list shows (never the full number). Mock until the payment provider is in. */
/** `saved: false` = added for this checkout only; dropped once it's done. */
export type CreditCard = { id: string; brand: string; last4: string; expiry: string; saved: boolean }

let cards: CreditCard[] = [{ id: "card-1", brand: "Visa", last4: "4242", expiry: "08/28", saved: true }]
const listeners = new Set<() => void>()

export function useCreditCards() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => cards,
    () => cards
  )
}

/** Brand from the first digits: 4 Visa, 51–55 / 2221–2720 Mastercard, 34/37 AMEX, 35 JCB. */
export function cardBrand(number: string) {
  if (/^4/.test(number)) return "Visa"
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(number)) return "Mastercard"
  if (/^3[47]/.test(number)) return "AMEX"
  if (/^35/.test(number)) return "JCB"
  return "信用卡"
}

const emit = () => listeners.forEach((listener) => listener())

/** Keeps the brand, last 4 digits and expiry only; returns the new card. */
export function addCreditCard(number: string, expiry: string, saved: boolean): CreditCard {
  const digits = number.replace(/\D/g, "")
  const card = { id: `card-${Date.now()}`, brand: cardBrand(digits), last4: digits.slice(-4), expiry, saved }
  cards = [...cards, card]
  emit()
  return card
}

/** After 結帳: cards the member chose not to save are gone. */
export function dropUnsavedCards() {
  if (cards.every((c) => c.saved)) return
  cards = cards.filter((c) => c.saved)
  emit()
}

// ——— Validation ———

/** 13–19 digits (no check digit test while prototyping, so any made-up number passes). */
export function isCardNumber(value: string) {
  const digits = value.replace(/\D/g, "")
  return digits.length >= 13 && digits.length <= 19
}

/** MM/YY, this month or later. */
export function isCardExpiry(value: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export const isCardCvc = (value: string) => /^\d{3,4}$/.test(value)
