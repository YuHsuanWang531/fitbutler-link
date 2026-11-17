"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import {
  INVOICE_TYPE_LABELS,
  isEmail,
  isMobileBarcode,
  isTaxId,
  lookupCompanyTitle,
  type InvoiceSetting,
} from "@/lib/invoice-setting"

type Type = InvoiceSetting["type"]
type Fields = { email: string; barcode: string; companyEmail: string; taxId: string; title: string }
type FieldKey = keyof Fields
type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onBlur" | "id">

const FORMAT_ERROR = "請輸入正確格式"

/** Which fields each type needs, and each field's check (null = fine). */
const RULES: Record<Type, FieldKey[]> = {
  member: ["email"],
  mobile: ["barcode"],
  company: ["companyEmail", "taxId", "title"],
}
const check: Record<FieldKey, (v: string) => string | null> = {
  email: (v) => (isEmail(v) ? null : FORMAT_ERROR),
  barcode: (v) => (isMobileBarcode(v) ? null : FORMAT_ERROR),
  companyEmail: (v) => (isEmail(v) ? null : FORMAT_ERROR),
  taxId: (v) => (isTaxId(v) ? null : FORMAT_ERROR),
  title: (v) => (v.trim() ? null : "請輸入公司抬頭"),
}

function toFields(s: InvoiceSetting): Fields {
  return {
    email: s.type === "member" ? s.email : "",
    barcode: s.type === "mobile" ? s.barcode : "",
    companyEmail: s.type === "company" ? s.email : "",
    taxId: s.type === "company" ? s.taxId : "",
    title: s.type === "company" ? s.title : "",
  }
}

export type InvoiceForm = ReturnType<typeof useInvoiceForm>
/** The picked type and the typed fields, to restore the form after leaving the page. */
export type InvoiceDraft = { type: Type | null; fields: Fields }

/**
 * State for 發票開立方式 on the plan page. No type is picked to start with; the fields are prefilled from the
 * saved setting (which arrives after hydration, so it is picked up until the member edits anything).
 * `validate()` returns "none" when no type is picked, null when a field is wrong (and shows the errors), or the
 * setting to save.
 */
export function useInvoiceForm(saved: InvoiceSetting, draft?: InvoiceDraft) {
  const [type, setType] = useState<Type | null>(draft?.type ?? null)
  const [fields, setFields] = useState<Fields>(() => draft?.fields ?? toFields(saved))
  // Errors show once a field is left (or on 結帳), not while typing the first time.
  const [touched, setTouched] = useState<Set<FieldKey>>(new Set())
  const [dirty, setDirty] = useState(!!draft)
  const [lastSaved, setLastSaved] = useState(saved)
  if (saved !== lastSaved) {
    setLastSaved(saved)
    if (!dirty) setFields(toFields(saved))
  }

  const pick = (t: Type) => {
    setDirty(true)
    setType(t)
  }
  const set = (key: FieldKey, value: string) => {
    setDirty(true)
    setFields((f) => {
      const next = { ...f, [key]: value }
      // 自動帶入公司抬頭 once the 統一編號 matches a known company.
      if (key === "taxId") {
        const title = lookupCompanyTitle(value)
        if (title) next.title = title
      }
      return next
    })
  }
  const touch = (key: FieldKey) => setTouched((t) => new Set(t).add(key))
  const errorOf = (key: FieldKey) => (touched.has(key) ? check[key](fields[key]) : null)

  const validate = (): InvoiceSetting | "none" | null => {
    if (!type) return "none"
    const keys = RULES[type]
    setTouched((t) => new Set([...t, ...keys]))
    if (keys.some((k) => check[k](fields[k]))) return null
    const f = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()])) as Fields
    return type === "member"
      ? { type, email: f.email }
      : type === "mobile"
        ? { type, barcode: f.barcode }
        : { type, email: f.companyEmail, taxId: f.taxId, title: f.title }
  }

  return { type, pick, fields, set, touch, errorOf, validate }
}

/** 發票開立方式: 會員載具 / 手機條碼載具 / 統一編號 as radio cards, like 付款方式; the picked one expands its fields. */
export function InvoiceFields({ form }: { form: InvoiceForm }) {
  const field = (key: FieldKey, label: string, props: InputProps, hint?: string) => (
    <TextField
      id={`invoice-${key}`}
      label={label}
      value={form.fields[key]}
      onChange={(v) => form.set(key, v)}
      onBlur={() => form.touch(key)}
      error={form.errorOf(key)}
      hint={hint}
      {...props}
    />
  )

  return (
    <div role="radiogroup" aria-labelledby="plan-invoice-label" className="flex flex-col gap-2">
      {(Object.keys(RULES) as Type[]).map((t) => {
        const selected = t === form.type
        return (
          <div key={t} className={cn("rounded-[10px] border", selected ? "border-black" : "border-neutral-200")}>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => form.pick(t)}
              className="flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left text-[15px]"
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-[5px] border-black" : "border-neutral-300"
                )}
              />
              <span className="flex-1">{INVOICE_TYPE_LABELS[t]}</span>
            </button>
            {selected && (
              <div className="flex flex-col gap-4 border-t border-neutral-100 px-4 pt-3 pb-4">
                {t === "member" &&
                  field(
                    "email",
                    "電子信箱",
                    { type: "email", inputMode: "email", autoComplete: "email", placeholder: "請輸入你的電子信箱" },
                    "＊發票中獎時會寄至您的信箱"
                  )}
                {t === "mobile" &&
                  field("barcode", "手機條碼載具", { placeholder: "/ABC123", autoCapitalize: "characters" })}
                {t === "company" && (
                  <>
                    {field(
                      "companyEmail",
                      "電子信箱",
                      { type: "email", inputMode: "email", autoComplete: "email", placeholder: "fitness@gmail.com" },
                      "發票會寄至您的信箱"
                    )}
                    {field("taxId", "統一編號", { inputMode: "numeric", maxLength: 8, placeholder: "12345678" })}
                    {field("title", "公司抬頭", { autoComplete: "organization" })}
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

type TextFieldProps = InputProps & {
  onBlur(): void
  id: string
  label: string
  value: string
  onChange(value: string): void
  error: string | null
  hint?: string
}

/** Labelled input; 必填 is marked with a red *. */
function TextField({ id, label, value, onChange, error, hint, ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      </label>
      <input
        id={id}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-note` : undefined}
        className={cn(
          "h-11 rounded-[10px] border px-3.5 text-base outline-none placeholder:text-neutral-400 focus:border-black",
          error ? "border-red-600" : "border-neutral-200"
        )}
        {...props}
      />
      {(error || hint) && (
        <p id={`${id}-note`} className={cn("text-sm leading-5", error ? "text-red-600" : "text-neutral-500")}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
