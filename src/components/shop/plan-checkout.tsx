"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, Check, ChevronDown, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { PlanCard } from "@/components/shop/plan-card"
import type { Plan } from "@/lib/shop-plans"
import { getTeacher } from "@/lib/member-teachers"
import { useLoggedIn } from "@/lib/auth"
import { clearPlanDraft, getPlanDraft, savePlanDraft } from "@/lib/plan-draft"
import { InvoiceFields, useInvoiceForm } from "@/components/shop/invoice-form"
import { CreditCardField } from "@/components/shop/credit-card-field"
import { ClampText } from "@/components/shop/clamp-text"
import { dropUnsavedCards } from "@/lib/credit-cards"
import { saveInvoiceSetting, useInvoiceSetting } from "@/lib/invoice-setting"
import {
  formatMoney,
  getPaymentOptions,
  isStoredShort,
  paymentTotal,
  type Activation,
  type PaymentOption,
  type PlanDetail,
} from "@/lib/shop-plan-detail"

/**
 * 方案內容: A｜一般方案 shows 方案資訊 / 購買內容 / 可使用場館 / 開始使用日; B｜儲值方案 keeps the plan card and 儲值內容.
 * Both: 付款方式 (live 明細 and total), 發票開立方式 (inline radio cards), and 結帳, which checks in order:
 * Signed out: only 方案資訊 and 購買內容, the top of the form blurred and faded under a 登入購買 box, and no checkout bar. Signed in, 結帳 checks: 授課老師 (私教課) → 啟用日 → 付款方式 → 信用卡 (一次付清／定期定額) → 發票資料 → 合約已簽署 → (儲值金不足 disables the button) → 付款頁; the 發票 setting is saved for next time.
 */
export function PlanCheckout({ plan, detail }: { plan: Plan; detail: PlanDetail }) {
  const router = useRouter()
  const loggedIn = useLoggedIn()
  const options = getPaymentOptions(plan, detail)
  const general = detail.kind === "general" ? detail : null

  // Back from signing the 合約, the page picks up where the member left off.
  const [draft] = useState(() => getPlanDraft(plan.id))
  const [paymentId, setPaymentId] = useState<string | null>(draft?.paymentId ?? null)
  const [date, setDate] = useState<string | null>(() => draft?.date ?? initialDate(general?.activation))
  const [venues, setVenues] = useState<string[]>(() => draft?.venues ?? general?.venues.slice(0, 1) ?? [])
  // 授課老師: only 私教課 plans ask for one, from the teachers who teach the plan.
  const teachers = plan.type === "私教課" ? (plan.teacherIds ?? []).flatMap((id) => getTeacher(id) ?? []) : []
  const [teacherId, setTeacherId] = useState(draft?.teacherId ?? "")
  const signed = draft?.signed ?? false
  const [cardId, setCardId] = useState<string | null>(draft?.cardId ?? null)
  const [alert, setAlert] = useState<string | null>(null)
  const invoice = useInvoiceForm(useInvoiceSetting(), draft?.invoice)
  const { type: invoiceType, fields: invoiceFields } = invoice
  useEffect(() => {
    savePlanDraft(plan.id, {
      paymentId,
      date,
      venues,
      teacherId,
      cardId,
      invoice: { type: invoiceType, fields: invoiceFields },
      signed,
    })
  }, [plan.id, paymentId, date, venues, teacherId, cardId, invoiceType, invoiceFields, signed])

  const payment = options.find((o) => o.id === paymentId) ?? null
  const total = payment ? paymentTotal(payment) : null
  const storedShort = payment ? isStoredShort(payment) : false

  const checkout = () => {
    const here = `/shop/${plan.id}`
    if (teachers.length > 0 && !teacherId) return setAlert("請選擇授課老師")
    if (general?.activation.kind === "member" && !date) return setAlert("請選擇開始使用日")
    if (!payment) return setAlert("請選擇付款方式")
    if (payment.method === "card" && !cardId) return setAlert("請選擇信用卡")
    const invoiceSetting = invoice.validate()
    if (invoiceSetting === "none") return setAlert("請選擇發票開立方式")
    if (!invoiceSetting) return setAlert("請輸入正確的發票資料")
    if (general?.contract && !signed) return setAlert("請先簽署合約")
    if (storedShort) return
    saveInvoiceSetting(invoiceSetting)
    const query = new URLSearchParams({ pay: payment.id })
    if (date) query.set("date", date)
    if (general) query.set("venues", venues.join(","))
    if (teacherId) query.set("teacher", teacherId)
    clearPlanDraft(plan.id)
    dropUnsavedCards()
    router.push(`${here}/payment?${query}`)
  }

  // Everything the member fills in; signed out it only shows blurred behind the 登入 box.
  const form = (
    <div className="flex flex-col gap-6">
      {general && (
        <div className="flex flex-col gap-6">
          <Field label="可使用場館" id="plan-venues" group>
            <VenuePicker options={general.venues} value={loggedIn ? venues : []} onChange={setVenues} />
          </Field>

          {teachers.length > 0 && (
            <Field label="授課老師" id="plan-teacher">
              <div className="relative">
                <select
                  id="plan-teacher"
                  required
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className={cn(
                    "h-11 w-full appearance-none rounded-[10px] border border-neutral-200 bg-white pr-11 pl-4 text-[15px] outline-none",
                    !teacherId && "text-neutral-500"
                  )}
                >
                  <option value="" disabled>
                    請選擇授課老師
                  </option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id} className="text-black">
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-neutral-500"
                  strokeWidth={1.5}
                />
              </div>
            </Field>
          )}

          <Field label="開始使用日" id="plan-date" required={general.activation.kind === "member"}>
            <ActivationField activation={general.activation} value={date} onChange={setDate} />
          </Field>

          {general.contract && (
            <Field label="合約簽署" id="plan-contract" group>
              {signed ? (
                <div className="flex h-11 items-center justify-between rounded-[10px] border border-neutral-200 px-4 text-[15px]">
                  <span className="flex items-center gap-2">
                    <Check aria-hidden className="size-4" strokeWidth={2} />
                    已簽署合約
                  </span>
                  <Link
                    href={`/shop/${plan.id}/contract`}
                    className="text-sm text-neutral-500 underline underline-offset-[3px]"
                  >
                    查看
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/shop/${plan.id}/contract/info`}
                  className="flex h-11 items-center justify-center rounded-[10px] border border-neutral-200 text-sm font-medium text-black hover:bg-neutral-50"
                >
                  簽署合約
                </Link>
              )}
            </Field>
          )}
        </div>
      )}

      <Field label="付款方式" id="plan-payment" group>
        <div role="radiogroup" aria-labelledby="plan-payment-label" className="flex flex-col gap-2">
          {options.map((option) => (
            <PaymentRow
              key={option.id}
              option={option}
              selected={option.id === paymentId}
              onSelect={() => setPaymentId(option.id)}
            />
          ))}
        </div>
      </Field>

      {/* 一次付清 and 定期定額 are charged to a card; 儲值金 isn't. */}
      {payment?.method === "card" && (
        <Field label="信用卡資訊" id="plan-card" group>
          <CreditCardField value={cardId} onChange={setCardId} />
        </Field>
      )}

      <Field label="發票開立方式" id="plan-invoice" group>
        <InvoiceFields form={invoice} />
      </Field>
    </div>
  )

  return (
    // Fills the screen (or the md+ card) so the checkout bar sits at the bottom even when the content is short.
    <div className="flex min-h-[calc(100dvh-61px-env(safe-area-inset-top))] flex-col md:min-h-full">
      <div className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-8 lg:px-6">
        {general ? (
          <>
            {/* 方案資訊 as plain text: name and 方案說明. */}
            <section aria-label="方案資訊" className="flex flex-col gap-2">
              <div className="flex flex-col gap-3">
                <h2 className="text-xl leading-7 font-medium">{plan.title}</h2>
                {general.description && (
                  <ClampText className="text-base leading-6 text-neutral-600">{general.description}</ClampText>
                )}
              </div>
            </section>

            {general.content.length > 0 && (
              <Field label="購買內容" id="plan-content" group required={false}>
                <ul className="flex flex-col gap-2">
                  {general.content.map((item) => (
                    <li
                      key={item.name}
                      className="flex min-h-11 items-center justify-between gap-3 rounded-[10px] border border-neutral-200 px-4 py-2.5 text-[15px]"
                    >
                      <span className="min-w-0">{item.name}</span>
                      <span className="shrink-0 text-sm text-neutral-500">{item.usage}</span>
                    </li>
                  ))}
                </ul>
              </Field>
            )}
          </>
        ) : (
          detail.kind === "stored" && (
            <>
              <div>
                <PlanCard plan={plan} />
              </div>
              <Section title="方案內容">
                <dl className="flex flex-col gap-3 text-[15px] leading-6">
                  <Row label="方案名稱">{plan.title}</Row>
                  {detail.items.map((item) => (
                    <Row key={item.label} label={item.label}>
                      {formatMoney(item.amount)}
                    </Row>
                  ))}
                  {detail.validity && <Row label="使用期限">{detail.validity}</Row>}
                </dl>
              </Section>
            </>
          )
        )}

        {/* Signed out: the top of the form shows blurred and faded out, with the 登入 box over it. */}
        {loggedIn ? (
          form
        ) : (
          <div className="relative -mx-4 -mt-3 max-h-[332px] overflow-hidden px-4 pt-3 lg:-mx-6 lg:px-6">
            <div inert className="pointer-events-none blur-[3px] select-none">
              {form}
            </div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-white/0 to-white" />
            <div className="absolute inset-0 flex items-center px-4 lg:px-6">
              <div className="flex w-full flex-col items-center gap-4 rounded-[10px] border border-neutral-200 bg-white px-4 py-6 text-center shadow-[0_8px_24px_-8px_rgb(0_0_0/0.18)]">
                <div className="flex flex-col items-center gap-1">
                  <Lock aria-hidden className="mb-1 size-6 text-neutral-500" strokeWidth={1.5} />
                  <p className="text-base leading-6 font-medium">登入會員即可購買</p>
                  <p className="text-sm leading-5 text-neutral-500">登入後即可選擇場館、付款方式並完成購買</p>
                </div>
                <Link
                  href={`/login?next=${encodeURIComponent(`/shop/${plan.id}`)}`}
                  className="flex h-11 w-36 items-center justify-center rounded-[10px] bg-black text-sm font-medium text-white hover:bg-neutral-800"
                >
                  登入購買
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout bar: pinned to the bottom of the window (phones) or of the card (md+); signed out has none. */}
      {loggedIn && (
        <div className="sticky bottom-0 z-10 flex items-center gap-4 border-t border-neutral-200 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:pb-3 lg:px-6">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs leading-4 text-neutral-500">總計</span>
            {total !== null ? (
              <span className="text-xl leading-7 font-semibold">{formatMoney(total)}</span>
            ) : (
              <span className="text-sm leading-7 text-neutral-500">請選擇付款方式</span>
            )}
          </div>
          <Button className="h-11 w-48 rounded-[10px] text-sm" disabled={storedShort} onClick={checkout}>
            結帳
          </Button>
        </div>
      )}

      <Dialog open={alert !== null} onOpenChange={(open) => !open && setAlert(null)}>
        <DialogContent showCloseButton={false} className="gap-4 p-5 sm:max-w-xs">
          <DialogTitle className="text-center text-base font-medium">{alert}</DialogTitle>
          <DialogFooter className="m-0 border-0 bg-white p-0">
            <Button className="h-10 w-full rounded-[10px]" onClick={() => setAlert(null)}>
              確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/**
 * A form field inside 方案內容: small label with a red * when required, then the control. `group` labels a set of
 * chips (aria-labelledby on the label) instead of a single input (htmlFor).
 */
function Field({
  label,
  id,
  group,
  required = true,
  children,
}: {
  label: string
  id: string
  group?: boolean
  required?: boolean
  children: React.ReactNode
}) {
  const Label = group ? "p" : "label"
  return (
    <div className="flex flex-col gap-2" {...(group && { role: "group", "aria-labelledby": `${id}-label` })}>
      <Label id={`${id}-label`} {...(!group && { htmlFor: id })} className="text-sm font-medium">
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden>
            *
          </span>
        )}
      </Label>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg leading-7 font-medium">{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <dt className="w-20 shrink-0 text-neutral-500">{label}</dt>
      <dd className="min-w-0 flex-1">{children}</dd>
    </div>
  )
}

// ——— 開始使用日 ———

const pad = (n: number) => String(n).padStart(2, "0")
/** yyyy-mm-dd (the date input's value). */
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const addDays = (d: Date, days: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
/** YYYY/MM/DD for display. */
const slashed = (iso: string) => iso.replaceAll("-", "/")

function initialDate(activation: Activation | undefined) {
  if (!activation) return null
  if (activation.kind === "immediate") return isoDate(new Date())
  if (activation.kind === "fixed") return activation.date.replaceAll("/", "-")
  return null
}

function ActivationField({
  activation,
  value,
  onChange,
}: {
  activation: Activation
  value: string | null
  onChange(value: string): void
}) {
  if (activation.kind !== "member") {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-[15px] leading-6">{value && slashed(value)}</p>
        <p className="text-sm leading-5 text-neutral-500">
          {activation.kind === "immediate" ? "購買後立即啟用" : "於此日期（含）以後生效"}
        </p>
      </div>
    )
  }
  const today = new Date()
  const min = isoDate(today)
  const max = isoDate(addDays(today, activation.days))
  return (
    <label
      className={cn(
        "relative flex h-11 items-center justify-between rounded-[10px] border border-neutral-200 px-4 text-[15px]",
        !value && "text-neutral-500"
      )}
    >
      {value ? slashed(value) : "請選擇日期"}
      <CalendarDays aria-hidden className="size-5 text-neutral-500" strokeWidth={1.5} />
      {/* The native picker, stretched invisibly over the field so tapping anywhere opens it. */}
      <input
        id="plan-date"
        type="date"
        required
        min={min}
        max={max}
        value={value ?? ""}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker()
          } catch {}
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  )
}

// ——— 可使用場館 ———

/** Pick any number of venues; the last one can't be unpicked. */
function VenuePicker({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange(value: string[]): void
}) {
  const toggle = (v: string) => {
    if (!value.includes(v)) onChange([...value, v])
    else if (value.length > 1) onChange(value.filter((x) => x !== v))
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((v) => {
        const selected = value.includes(v)
        return (
          <button
            key={v}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(v)}
            className={cn(
              "flex h-8 items-center rounded-[10px] border px-3.5 text-sm",
              selected ? "border-black bg-black text-white" : "border-neutral-200 text-black hover:bg-neutral-100"
            )}
          >
            {v}
          </button>
        )
      })}
    </div>
  )
}

// ——— 付款方式 ———

function PaymentRow({ option, selected, onSelect }: { option: PaymentOption; selected: boolean; onSelect(): void }) {
  const total = paymentTotal(option)
  const short = isStoredShort(option)
  return (
    <div className={cn("rounded-[10px] border", selected ? "border-black" : "border-neutral-200")}>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className="flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left text-[15px]"
      >
        <span
          aria-hidden
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-[5px] border-black" : "border-neutral-300"
          )}
        />
        <span className="flex-1">{option.label}</span>
      </button>
      {selected && (
        <div className="flex flex-col gap-1.5 border-t border-neutral-100 px-4 pt-3 pb-4 text-sm leading-5">
          {option.lines.map((line) => (
            <p key={line.label} className="flex justify-between text-neutral-600">
              <span>{line.label}</span>
              <span>{formatMoney(line.amount)}</span>
            </p>
          ))}
          {option.discounts.map((line) => (
            <p key={line.label} className="flex justify-between text-[#c2410c]">
              <span>{line.label}</span>
              <span>−{formatMoney(line.amount)}</span>
            </p>
          ))}
          <p className="mt-1 flex justify-between border-t border-neutral-100 pt-2.5 text-[15px] font-medium">
            <span>總計</span>
            <span>{formatMoney(total)}</span>
          </p>
          {option.hint && <p className="text-neutral-500">{option.hint}</p>}
          {short && <p className="font-medium text-red-600">儲值金不足</p>}
        </div>
      )}
    </div>
  )
}
