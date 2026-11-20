"use client"

import { useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { DropdownSelect } from "@/components/ui/dropdown-select"

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

const pad = (n: number) => String(n).padStart(2, "0")
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
/** [year, month (0-based)] of an ISO date. */
const ym = (date: string) => [Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1] as const

/** Six weeks starting on the Sunday on or before the 1st, so the calendar is always the same height. */
function weeks(year: number, month: number) {
  const start = new Date(year, month, 1 - new Date(year, month, 1).getDay())
  return Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d)
      return {
        date: iso(day.getFullYear(), day.getMonth(), day.getDate()),
        day: day.getDate(),
        inMonth: day.getMonth() === month,
      }
    })
  )
}

/**
 * The site's date field: a 44px field showing the date, and 8px below it (in the flow, pushing what's under it down) a
 * calendar with ‹ 月 年 › on top, 日–六 and six weeks. Days of other months are grey; days outside `min`–`max` can't
 * be picked. Picking a day closes the calendar.
 */
export function DatePicker({
  id,
  value,
  onChange,
  min,
  max,
  placeholder = "請選擇日期",
  format = (date) => date.replaceAll("-", "/"),
  invalid,
}: {
  id?: string
  /** ISO date (YYYY-MM-DD), or null when nothing is picked. */
  value: string | null
  onChange(value: string): void
  min?: string
  max?: string
  placeholder?: string
  format?: (date: string) => string
  invalid?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [[year, month], setShown] = useState(() =>
    ym(value ?? min ?? iso(new Date().getFullYear(), new Date().getMonth(), 1))
  )

  const firstYear = min ? ym(min)[0] : year - 50
  const lastYear = max ? ym(max)[0] : year + 10
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => String(firstYear + i))
  const monthKey = (y: number, m: number) => y * 12 + m
  const canPrev = !min || monthKey(year, month) > monthKey(...ym(min))
  const canNext = !max || monthKey(year, month) < monthKey(...ym(max))
  const go = (delta: number) => {
    const d = new Date(year, month + delta, 1)
    setShown([d.getFullYear(), d.getMonth()])
  }
  const outOfRange = (date: string) => (!!min && date < min) || (!!max && date > max)

  return (
    <div className="flex flex-col gap-2">
      <button
        id={id}
        type="button"
        aria-expanded={open}
        onClick={() => {
          if (!open && value) setShown(ym(value))
          setOpen(!open)
        }}
        className={cn(
          "flex h-11 w-full items-center gap-6 rounded-[10px] border bg-white px-4 text-left text-sm",
          invalid ? "border-destructive" : "border-neutral-200",
          !value && "text-neutral-500"
        )}
      >
        <span className="min-w-0 flex-1 truncate">{value ? format(value) : placeholder}</span>
        <CalendarDays aria-hidden className="size-5 shrink-0 text-neutral-500" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="flex flex-col gap-4 rounded-[10px] border border-neutral-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="上個月"
              disabled={!canPrev}
              onClick={() => go(-1)}
              className="disabled:opacity-30"
            >
              <ChevronLeft aria-hidden className="size-4" strokeWidth={1.5} />
            </button>
            <div className="flex min-w-0 flex-1 gap-1.5">
              <DropdownSelect
                size="sm"
                label="月份"
                options={Array.from({ length: 12 }, (_, m) => ({ value: String(m), label: `${m + 1}月` }))}
                value={String(month)}
                onChange={(m) => setShown([year, Number(m)])}
              />
              <DropdownSelect
                size="sm"
                label="年份"
                options={years.map((y) => ({ value: y, label: y }))}
                value={String(year)}
                onChange={(y) => setShown([Number(y), month])}
              />
            </div>
            <button
              type="button"
              aria-label="下個月"
              disabled={!canNext}
              onClick={() => go(1)}
              className="disabled:opacity-30"
            >
              <ChevronRight aria-hidden className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <div aria-label={`${year}年${month + 1}月`} role="group" className="flex flex-col gap-2">
            <div aria-hidden className="flex">
              {WEEKDAYS.map((d) => (
                <span key={d} className="flex-1 py-0.5 text-center text-xs leading-4 text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
            {weeks(year, month).map((week) => (
              <div key={week[0].date} className="flex">
                {week.map(({ date, day, inMonth }) => {
                  const selected = date === value
                  const disabled = outOfRange(date)
                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      aria-label={format(date)}
                      onClick={() => {
                        onChange(date)
                        setOpen(false)
                      }}
                      className={cn(
                        "h-8 min-w-0 flex-1 rounded-[10px] text-sm",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : disabled
                            ? "text-neutral-300"
                            : cn("hover:bg-neutral-100", inMonth ? "text-card-foreground" : "text-muted-foreground")
                      )}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
