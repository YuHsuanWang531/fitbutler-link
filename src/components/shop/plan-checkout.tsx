"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, Check, ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { PlanCard } from "@/components/shop/plan-card"
import type { Plan } from "@/lib/shop-plans"
import { INVOICE_TYPE_LABELS, useInvoiceSetting } from "@/lib/invoice-setting"
import {
  formatMoney,
  getPaymentOptions,
  isStoredShort,
  MOCK_MEMBER,
  paymentTotal,
  type Activation,
  type PaymentOption,
  type PlanDetail,
} from "@/lib/shop-plan-detail"

const VENUES_COLLAPSED = 3

/**
 * 方案內容 (spec 6.2): A｜一般方案 shows 方案內容 / 會籍啟用日 / 可使用場館; B｜儲值方案 shows 儲值內容.
 * Both: 付款方式 (live 明細 and total), 發票開立方式, and 結帳, which runs the checkout checks in order:
 * 登入 → 啟用日 → 付款方式 → (儲值金不足 disables the button) → 合約 or 付款頁.
 */
export function PlanCheckout({ plan, detail }: { plan: Plan; detail: PlanDetail }) {
  const router = useRouter()
  const options = getPaymentOptions(plan, detail)
  const general = detail.kind === "general" ? detail : null

  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(() => initialDate(general?.activation))
  const [venues, setVenues] = useState<string[]>(() =>
    general?.venueRule.selectable ? general.venues.slice(0, 1) : (general?.venues ?? [])
  )
  const [alert, setAlert] = useState<string | null>(null)
  const invoice = useInvoiceSetting()

  const payment = options.find((o) => o.id === paymentId) ?? null
  const total = payment ? paymentTotal(payment) : null
  const storedShort = payment ? isStoredShort(payment) : false

  const checkout = () => {
    const here = `/shop/${plan.id}`
    if (!MOCK_MEMBER.loggedIn) return router.push(`/login?next=${encodeURIComponent(here)}`)
    if (general?.activation.kind === "member" && !date) return setAlert("請選擇會籍啟用日")
    if (!payment) return setAlert("請選擇付款方式")
    if (storedShort) return
    const query = new URLSearchParams({ pay: payment.id })
    if (date) query.set("date", date)
    if (general?.venueRule.selectable) query.set("venues", venues.join(","))
    router.push(`${here}/${general?.contract ? "contract" : "payment"}?${query}`)
  }

  return (
    // Fills the screen (or the md+ card) so the checkout bar sits at the bottom even when the content is short.
    <div className="flex min-h-[calc(100dvh-61px-env(safe-area-inset-top))] flex-col md:min-h-full">
      <div className="flex flex-1 flex-col divide-y divide-neutral-200 px-4 lg:px-6 *:py-6 *:first:pt-4">
        <div>
          <PlanCard plan={plan} />
        </div>

        {general ? (
          <>
            <Section title="方案內容">
              <dl className="flex flex-col gap-3 text-[15px] leading-6">
                <Row label="會籍名稱">{plan.title}</Row>
                <Row label="使用時間">{general.usage}</Row>
                {general.benefits.length > 0 && (
                  <Row label="權益">
                    <ul className="flex list-disc flex-col gap-0.5 pl-4 marker:text-neutral-400">
                      {general.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </Row>
                )}
              </dl>
            </Section>

            <Section title="會籍啟用日">
              <ActivationField activation={general.activation} value={date} onChange={setDate} />
            </Section>

            <Section title="可使用場館">
              {general.venueRule.selectable ? (
                <VenuePicker options={general.venues} max={general.venueRule.max} value={venues} onChange={setVenues} />
              ) : (
                <VenueList venues={general.venues} />
              )}
            </Section>
          </>
        ) : (
          detail.kind === "stored" && (
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
          )
        )}

        <Section title="付款方式">
          <div role="radiogroup" aria-label="付款方式" className="flex flex-col gap-2">
            {options.map((option) => (
              <PaymentRow
                key={option.id}
                option={option}
                selected={option.id === paymentId}
                onSelect={() => setPaymentId(option.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="發票開立方式">
          <Link
            href={`/invoice?next=${encodeURIComponent(`/shop/${plan.id}`)}`}
            className="flex h-12 items-center justify-between rounded-[10px] border border-neutral-200 px-4 text-[15px] hover:bg-neutral-50"
          >
            {INVOICE_TYPE_LABELS[invoice.type]}
            <ChevronRight aria-hidden className="size-5 text-neutral-400" strokeWidth={1.5} />
          </Link>
        </Section>
      </div>

      {/* Checkout bar: pinned to the bottom of the window (phones) or of the card (md+). */}
      <div className="sticky bottom-0 z-10 flex items-center gap-4 border-t border-neutral-200 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:pb-3 lg:px-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs leading-4 text-neutral-500">總計</span>
          {total !== null ? (
            <span className="text-xl leading-7 font-semibold">{formatMoney(total)}</span>
          ) : (
            <span className="text-sm leading-7 text-neutral-500">請選擇付款方式</span>
          )}
        </div>
        <Button className="h-11 w-36 rounded-[8px] text-base" disabled={storedShort} onClick={checkout}>
          結帳
        </Button>
      </div>

      <Dialog open={alert !== null} onOpenChange={(open) => !open && setAlert(null)}>
        <DialogContent showCloseButton={false} className="gap-4 p-5 sm:max-w-xs">
          <DialogTitle className="text-center text-base font-medium">{alert}</DialogTitle>
          <DialogFooter className="m-0 border-0 bg-white p-0">
            <Button className="h-10 w-full rounded-[8px]" onClick={() => setAlert(null)}>
              確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

// ——— 會籍啟用日 ———

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
    <div className="flex flex-col gap-1.5">
      <label
        className={cn(
          "relative flex h-12 items-center justify-between rounded-[10px] border px-4 text-[15px]",
          value ? "border-black" : "border-neutral-200 text-neutral-500"
        )}
      >
        {value ? slashed(value) : "請選擇日期"}
        <CalendarDays aria-hidden className="size-5 text-neutral-500" strokeWidth={1.5} />
        {/* The native picker, stretched invisibly over the field so tapping anywhere opens it. */}
        <input
          type="date"
          required
          aria-label="會籍啟用日"
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
      <p className="text-sm leading-5 text-neutral-500">
        可選 {slashed(min)}–{slashed(max)}
      </p>
    </div>
  )
}

// ——— 可使用場館 ———

/** Not selectable: the first three, the rest behind a V toggle. */
function VenueList({ venues }: { venues: string[] }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? venues : venues.slice(0, VENUES_COLLAPSED)
  const hidden = venues.length - VENUES_COLLAPSED
  return (
    <div className="flex flex-col">
      <ul className="flex flex-col text-[15px] leading-6">
        {shown.map((v) => (
          <li key={v} className="border-b border-neutral-100 py-2.5 last:border-0">
            {v}
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          className="flex h-10 items-center justify-center gap-1 text-sm text-neutral-600"
        >
          {expanded ? "收合" : `展開其餘 ${hidden} 間`}
          <ChevronDown aria-hidden className={cn("size-4 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </div>
  )
}

/** Selectable: pick 1 to `max`; the last one can't be unpicked, and the rest lock once `max` is reached. */
function VenuePicker({
  options,
  max,
  value,
  onChange,
}: {
  options: string[]
  max: number
  value: string[]
  onChange(value: string[]): void
}) {
  const full = value.length >= max
  const toggle = (v: string) => {
    if (value.includes(v)) {
      if (value.length > 1) onChange(value.filter((x) => x !== v))
    } else if (max === 1) onChange([v])
    else if (!full) onChange([...value, v])
  }
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm leading-5 text-neutral-500">
        {max === 1 ? "請選擇 1 間場館" : `可選 1–${max} 間，已選 ${value.length} 間`}
      </p>
      <ul className="flex flex-col">
        {options.map((v) => {
          const selected = value.includes(v)
          // max 1 behaves like a radio: picking another one swaps.
          const locked = !selected && full && max > 1
          return (
            <li key={v} className="border-b border-neutral-100 last:border-0">
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-disabled={locked || (selected && value.length === 1)}
                onClick={() => toggle(v)}
                className={cn(
                  "flex h-12 w-full items-center gap-3 text-left text-[15px]",
                  locked && "cursor-not-allowed text-neutral-400"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-black bg-black text-white" : "border-neutral-300"
                  )}
                >
                  {selected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                {v}
              </button>
            </li>
          )
        })}
      </ul>
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
        className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left text-[15px]"
      >
        <span
          aria-hidden
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-[6px] border-black" : "border-neutral-300"
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
