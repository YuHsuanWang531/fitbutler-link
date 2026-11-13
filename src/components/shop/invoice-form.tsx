"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import {
  INVOICE_TYPE_LABELS,
  isEmail,
  isMobileBarcode,
  isTaxId,
  lookupCompanyTitle,
  saveInvoiceSetting,
  useInvoiceSetting,
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

/**
 * 發票開立方式: 會員載具 (default) / 手機條碼載具 / 統一編號, each expanding its own fields. 儲存 in the header
 * checks every field of the picked type; any failure → 「請輸入正確格式資料」.
 */
export function InvoiceForm({ fallbackHref }: { fallbackHref: string }) {
  const saved = useInvoiceSetting()
  // Keyed: on a direct load the saved setting arrives after hydration, so the form restarts from it.
  return <Form key={JSON.stringify(saved)} saved={saved} fallbackHref={fallbackHref} />
}

function Form({ saved, fallbackHref }: { saved: InvoiceSetting; fallbackHref: string }) {
  const router = useRouter()
  const [type, setType] = useState<Type>(saved.type)
  const [fields, setFields] = useState<Fields>(() => toFields(saved))
  // Errors show once a field is left (or on 儲存), not while typing the first time.
  const [touched, setTouched] = useState<Set<FieldKey>>(new Set())
  const [failed, setFailed] = useState(false)

  const errorOf = (key: FieldKey) => (touched.has(key) ? check[key](fields[key]) : null)
  const touch = (key: FieldKey) => setTouched((t) => new Set(t).add(key))
  const set = (key: FieldKey, value: string) => {
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

  const save = () => {
    const keys = RULES[type]
    setTouched((t) => new Set([...t, ...keys]))
    if (keys.some((k) => check[k](fields[k]))) return setFailed(true)
    const f = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.trim()])) as Fields
    saveInvoiceSetting(
      type === "member"
        ? { type, email: f.email }
        : type === "mobile"
          ? { type, barcode: f.barcode }
          : { type, email: f.companyEmail, taxId: f.taxId, title: f.title }
    )
    if (window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }

  const field = (key: FieldKey, label: string, props: InputProps, hint?: string) => (
    <TextField
      id={`invoice-${key}`}
      label={label}
      value={fields[key]}
      onChange={(v) => set(key, v)}
      onBlur={() => touch(key)}
      error={errorOf(key)}
      hint={hint}
      {...props}
    />
  )

  return (
    <>
      <MemberPageHeader
        title="發票開立方式"
        fallbackHref={fallbackHref}
        action={
          <button type="button" onClick={save} className="text-base font-medium text-black">
            儲存
          </button>
        }
      />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <div className="flex flex-col gap-3 px-4 py-4 lg:px-6">
          <h2 className="text-lg leading-7 font-medium">發票類型</h2>
          <div role="radiogroup" aria-label="發票類型" className="flex flex-col gap-2">
            {(Object.keys(RULES) as Type[]).map((t) => {
              const selected = t === type
              return (
                <div key={t} className={cn("rounded-[10px] border", selected ? "border-black" : "border-neutral-200")}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setType(t)}
                    className="flex h-12 w-full items-center gap-3 px-4 text-left text-[15px]"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-5 shrink-0 rounded-full border",
                        selected ? "border-[6px] border-black" : "border-neutral-300"
                      )}
                    />
                    {INVOICE_TYPE_LABELS[t]}
                  </button>
                  {selected && (
                    <div className="flex flex-col gap-4 border-t border-neutral-100 px-4 pt-3 pb-4">
                      {t === "member" &&
                        field(
                          "email",
                          "電子信箱",
                          {
                            type: "email",
                            inputMode: "email",
                            autoComplete: "email",
                            placeholder: "請輸入你的電子信箱",
                          },
                          "＊發票中獎時會寄至您的信箱"
                        )}
                      {t === "mobile" &&
                        field("barcode", "手機條碼載具", { placeholder: "/ABC123", autoCapitalize: "characters" })}
                      {t === "company" && (
                        <>
                          {field(
                            "companyEmail",
                            "電子信箱",
                            {
                              type: "email",
                              inputMode: "email",
                              autoComplete: "email",
                              placeholder: "fitness@gmail.com",
                            },
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
        </div>
      </MemberMain>

      <Dialog open={failed} onOpenChange={setFailed}>
        <DialogContent showCloseButton={false} className="gap-4 p-5 sm:max-w-xs">
          <DialogTitle className="text-center text-base font-medium">請輸入正確格式資料</DialogTitle>
          <DialogFooter className="m-0 border-0 bg-white p-0">
            <Button className="h-10 w-full rounded-[8px]" onClick={() => setFailed(false)}>
              確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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

/** Labelled input; 必填 is marked with a red ＊. */
function TextField({ id, label, value, onChange, error, hint, ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        <span className="ml-0.5 text-red-600" aria-hidden>
          ＊
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
