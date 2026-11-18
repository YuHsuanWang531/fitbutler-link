"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { addCreditCard, isCardCvc, isCardExpiry, isCardNumber, useCreditCards } from "@/lib/credit-cards"

/** 信用卡資訊: saved cards as radio rows (like 付款方式), then 新增信用卡, which adds and picks the new card. */
export function CreditCardField({ value, onChange }: { value: string | null; onChange(id: string): void }) {
  const cards = useCreditCards()
  const [adding, setAdding] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-labelledby="plan-card-label" className="flex flex-col gap-2">
        {cards.map((card) => {
          const selected = card.id === value
          return (
            <button
              key={card.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(card.id)}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-[10px] border px-4 py-2.5 text-left text-sm",
                selected ? "border-black" : "border-neutral-200"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-[5px] border-black" : "border-neutral-300"
                )}
              />
              <span className="flex-1">
                {card.brand} •••• {card.last4}
              </span>
              <span className="text-sm text-neutral-500">{card.expiry}</span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex h-11 items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-neutral-300 text-sm text-black hover:bg-neutral-50"
      >
        <Plus aria-hidden className="size-4" strokeWidth={1.75} />
        新增信用卡
      </button>
      <AddCardDialog
        open={adding}
        onOpenChange={setAdding}
        onAdded={(id) => {
          onChange(id)
          setAdding(false)
        }}
      />
    </div>
  )
}

type Draft = { number: string; expiry: string; cvc: string }
const EMPTY: Draft = { number: "", expiry: "", cvc: "" }
const ERRORS: Record<keyof Draft, string> = {
  number: "請輸入正確的卡號",
  expiry: "請輸入正確的有效期限",
  cvc: "請輸入正確的安全碼",
}

/** 卡號 grouped by 4, 有效期限 as MM/YY. */
const formatNumber = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function AddCardDialog({
  open,
  onOpenChange,
  onAdded,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  onAdded(id: string): void
}) {
  const [draft, setDraft] = useState(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const [save, setSave] = useState(true)
  // Each time it opens, start empty.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setDraft(EMPTY)
      setErrors({})
      setSave(true)
    }
  }

  const submit = () => {
    const next: Partial<Record<keyof Draft, string>> = {}
    if (!isCardNumber(draft.number)) next.number = ERRORS.number
    if (!isCardExpiry(draft.expiry)) next.expiry = ERRORS.expiry
    if (!isCardCvc(draft.cvc)) next.cvc = ERRORS.cvc
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onAdded(addCreditCard(draft.number, draft.expiry, save).id)
  }

  const input = (key: keyof Draft, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`card-${key}`} className="text-sm font-medium">
        {label}
        <span className="ml-0.5 text-destructive" aria-hidden>
          *
        </span>
      </label>
      <input
        id={`card-${key}`}
        required
        value={draft[key]}
        onChange={(e) => {
          const raw = e.target.value
          const value =
            key === "number"
              ? formatNumber(raw)
              : key === "expiry"
                ? formatExpiry(raw)
                : raw.replace(/\D/g, "").slice(0, 4)
          setDraft((d) => ({ ...d, [key]: value }))
          setErrors((e) => ({ ...e, [key]: undefined }))
        }}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `card-${key}-error` : undefined}
        className={cn(
          "h-11 w-full rounded-[10px] border px-3.5 text-base outline-none placeholder:text-neutral-400 focus:border-black",
          errors[key] ? "border-destructive" : "border-neutral-200"
        )}
        {...props}
      />
      {errors[key] && (
        <p id={`card-${key}-error`} className="text-sm leading-5 text-destructive">
          {errors[key]}
        </p>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 p-5 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">新增信用卡</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {input("number", "卡號", {
            inputMode: "numeric",
            autoComplete: "cc-number",
            placeholder: "0000 0000 0000 0000",
          })}
          <div className="grid grid-cols-2 gap-3">
            {input("expiry", "有效期限", { inputMode: "numeric", autoComplete: "cc-exp", placeholder: "MM/YY" })}
            {input("cvc", "安全碼", { inputMode: "numeric", autoComplete: "cc-csc", placeholder: "CVC" })}
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm leading-5">
            <input
              type="checkbox"
              checked={save}
              onChange={(e) => setSave(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded border peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50",
                save ? "border-black bg-black text-white" : "border-neutral-300"
              )}
            >
              {save && <Check className="size-3" strokeWidth={3} />}
            </span>
            儲存卡片下次結帳即可使用
          </label>
        </div>
        <DialogFooter className="m-0 flex-col gap-2 border-0 bg-white p-0 sm:flex-col">
          <Button className="h-11 w-full rounded-[10px] text-sm" onClick={submit}>
            新增
          </Button>
          <Button variant="outline" className="h-11 w-full rounded-[10px] text-sm" onClick={() => onOpenChange(false)}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
