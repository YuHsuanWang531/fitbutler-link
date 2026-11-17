"use client"

import { useSyncExternalStore } from "react"

// Mock 登入狀態 for designing 登入前／登入後 until real login exists. Kept per browser so a reload stays put;
// defaults to logged in (what the pages were built for).

const KEY = "fitbutler:logged-in"
const listeners = new Set<() => void>()

function read() {
  try {
    return localStorage.getItem(KEY) !== "0"
  } catch {
    return true
  }
}

export function setLoggedIn(next: boolean) {
  try {
    localStorage.setItem(KEY, next ? "1" : "0")
  } catch {}
  listeners.forEach((listener) => listener())
}

export function useLoggedIn() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    read,
    () => true
  )
}
