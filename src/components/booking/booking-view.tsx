"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"
import { useCalendarScroll } from "@/hooks/use-calendar-scroll"
import { useHorizontalSwipe } from "@/hooks/use-horizontal-swipe"
import { bookingApi } from "@/lib/booking/api"
import { classAction, countActiveFilters, matchesFilters, type ClassAction } from "@/lib/booking/classes"
import {
  WEEKDAY_LABELS,
  addDays,
  addMonths,
  eachDay,
  formatMonthTitle,
  formatWeekTitle,
  monthDays,
  monthWeeks,
  startOfMonth,
  startOfWeek,
  toKey,
} from "@/lib/booking/dates"
import { NO_FILTERS, type ClassCategory, type ClassFilters, type GymClass, type Teacher } from "@/lib/booking/types"
import { AppliedFilters } from "@/components/booking/applied-filters"
import { BookingToolbar, type BookingMode } from "@/components/booking/booking-toolbar"
import { CalendarGrid } from "@/components/booking/calendar-grid"
import { FilterPanel } from "@/components/booking/filter-panel"
import { TimelineDay } from "@/components/booking/timeline-day"

const subscribeNever = () => () => {}

/** "Today" comes from the client clock, so the page renders after hydration. */
export function BookingView() {
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false)
  return hydrated ? <BookingScreen /> : <div className="min-h-dvh" />
}

/** `expanded`: show the day under the fully open month instead of the collapsed one. */
type PendingScroll = { type: "day"; key: string; expanded?: boolean } | { type: "top" }

function BookingScreen() {
  const [today] = useState(() => new Date())
  const [now, setNow] = useState(today)
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  const todayKey = toKey(today)

  const [mode, setMode] = useState<BookingMode>("month")
  /** First day of the month (month view) or Sunday of the week (week view). */
  const [anchor, setAnchor] = useState(() => startOfMonth(today))
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [filters, setFilters] = useState<ClassFilters>(NO_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [options, setOptions] = useState<{ categories: ClassCategory[]; teachers: Teacher[] }>({ categories: [], teachers: [] })
  const [data, setData] = useState<{ span: string; classes: GymClass[] }>({ span: "", classes: [] })
  /** Where to scroll once the next range has rendered. Opens on today, under the fully open month. */
  const pendingScroll = useRef<PendingScroll | null>({ type: "day", key: todayKey, expanded: true })

  const weeks = useMemo(
    () => (mode === "month" ? monthWeeks(anchor) : [eachDay(anchor, addDays(anchor, 6))]),
    [mode, anchor]
  )
  const days = useMemo(() => (mode === "month" ? monthDays(anchor) : weeks[0]), [mode, anchor, weeks])
  const dayKeys = useMemo(() => new Set(days.map(toKey)), [days])

  // Fetch the whole calendar span (incl. adjacent-month days) so their dots show too.
  const spanFrom = toKey(weeks[0][0])
  const spanTo = toKey(weeks[weeks.length - 1][6])
  const span = `${spanFrom}_${spanTo}`
  useEffect(() => {
    let alive = true
    bookingApi.fetchClasses(spanFrom, spanTo).then((classes) => {
      if (alive) setData({ span, classes })
    })
    return () => {
      alive = false
    }
  }, [span, spanFrom, spanTo])
  useEffect(() => {
    bookingApi.fetchFilterOptions().then(setOptions)
  }, [])

  const loaded = data.span === span
  const allClasses = useMemo(() => (loaded ? data.classes : []), [loaded, data.classes])
  const rangeClasses = useMemo(() => allClasses.filter((c) => dayKeys.has(c.date)), [allClasses, dayKeys])
  const byDay = useMemo(() => {
    const map = new Map<string, { all: number; visible: GymClass[] }>()
    for (const c of allClasses) {
      const entry = map.get(c.date) ?? { all: 0, visible: [] }
      entry.all += 1
      if (matchesFilters(c, filters)) entry.visible.push(c)
      map.set(c.date, entry)
    }
    return map
  }, [allClasses, filters])
  const dotKeys = useMemo(
    () => new Set([...byDay].filter(([, e]) => e.visible.length > 0).map(([key]) => key)),
    [byDay]
  )

  const activeFilterCount = countActiveFilters(filters)
  const weekIndex = Math.max(0, weeks.findIndex((week) => week.some((d) => toKey(d) === selectedKey)))

  // Refs for the scroll-linked calendar (see useCalendarScroll).
  const root = useRef<HTMLDivElement>(null)
  const zone = useRef<HTMLDivElement>(null)
  const calendarViewport = useRef<HTMLDivElement>(null)
  const calendarRows = useRef<HTMLDivElement>(null)
  const spacer = useRef<HTMLDivElement>(null)
  /** Wraps the calendar rows; slides sideways while swiping between weeks. */
  const swipeTrack = useRef<HTMLDivElement>(null)
  const closeOverlay = useCallback(() => setOverlayOpen(false), [])

  const { collapsed, scrollToDay, scrollToDayExpanded, scrollToTop } = useCalendarScroll({
    root,
    zone,
    calendarViewport,
    calendarRows,
    spacer,
    collapsible: mode === "month",
    weekIndex,
    layoutKey: `${mode}|${span}|${loaded}|${filters.category}|${filters.teacherId}`,
    onActiveDayChange: setSelectedKey,
    onUserScroll: closeOverlay,
  })

  // Runs after useCalendarScroll has measured the new content.
  useLayoutEffect(() => {
    const pending = pendingScroll.current
    if (!loaded || !pending) return
    pendingScroll.current = null
    if (pending.type === "top") scrollToTop()
    else if (pending.expanded) scrollToDayExpanded(pending.key)
    else scrollToDay(pending.key, { smooth: false })
  }, [loaded, span, filters, scrollToDay, scrollToDayExpanded, scrollToTop])

  /**
   * Switch month/week or move to another range. Lands on `focusKey`, else today if it's in range, else the top.
   * `focusKey: null` forces the top (month fully open).
   */
  const showRange = (nextMode: BookingMode, nextAnchor: Date, focusKey?: string | null) => {
    const nextDays = nextMode === "month" ? monthDays(nextAnchor) : eachDay(nextAnchor, addDays(nextAnchor, 6))
    const target =
      focusKey !== undefined ? focusKey : nextDays.some((d) => toKey(d) === todayKey) ? todayKey : null
    setSelectedKey(target ?? toKey(nextDays[0]))
    // A new month always opens fully expanded, with the target day (if any) right under it.
    pendingScroll.current = target ? { type: "day", key: target, expanded: nextMode === "month" } : { type: "top" }
    setOverlayOpen(false)
    setMode(nextMode)
    setAnchor(nextAnchor)
  }

  const step = (direction: 1 | -1) =>
    mode === "month" ? showRange("month", addMonths(anchor, direction)) : showRange("week", addDays(anchor, 7 * direction))

  /**
   * Collapsed month: the visible row is one week, so a swipe moves the timeline a week. Lands on today if that
   * week has it, else the week's first day in this month; a week entirely in another month switches months.
   */
  const swipeCollapsedWeek = (direction: 1 | -1) => {
    const selected = days.find((d) => toKey(d) === selectedKey) ?? days[0]
    const weekStart = addDays(startOfWeek(selected), 7 * direction)
    const week = eachDay(weekStart, addDays(weekStart, 6))
    const inMonth = week.filter((d) => dayKeys.has(toKey(d)))
    const today = week.find((d) => toKey(d) === todayKey)
    if (inMonth.length === 0) return showRange("month", startOfMonth(weekStart), toKey(today ?? weekStart))
    const target = toKey(today && dayKeys.has(todayKey) ? today : inMonth[0])
    setSelectedKey(target)
    scrollToDay(target, { smooth: true })
  }

  // Swipe the single calendar row (week view, or the collapsed month) left/right for the next/previous week.
  useHorizontalSwipe(swipeTrack, {
    enabled: mode === "week" || collapsed,
    onSwipe: (direction) => (mode === "week" ? step(direction) : swipeCollapsedWeek(direction)),
  })

  const selectDay = (day: Date) => {
    const key = toKey(day)
    setOverlayOpen(false)
    if (!dayKeys.has(key)) return showRange("month", startOfMonth(day), key)
    setSelectedKey(key)
    scrollToDay(key, { smooth: true })
  }

  const changeMode = (next: BookingMode) => {
    if (next === mode) return
    const selected = days.find((d) => toKey(d) === selectedKey) ?? days[0]
    if (next === "week") return showRange("week", startOfWeek(selected), toKey(selected))
    showRange("month", startOfMonth(selected), toKey(selected))
  }

  /** Re-anchor on the selected day after the timeline's content changes. */
  const applyFilters = (next: ClassFilters) => {
    pendingScroll.current = { type: "day", key: selectedKey }
    setFilters(next)
    setFilterOpen(false)
  }

  const runAction = async (gymClass: GymClass, action: ClassAction) => {
    const call = {
      book: bookingApi.book,
      booked: bookingApi.cancelBooking,
      waitlist: bookingApi.joinWaitlist,
      waitlisted: bookingApi.leaveWaitlist,
    }[action as "book" | "booked" | "waitlist" | "waitlisted"]
    if (!call) return
    setPendingId(gymClass.id)
    try {
      const updated = await call(gymClass.id)
      setData((d) => ({ ...d, classes: d.classes.map((c) => (c.id === updated.id ? updated : c)) }))
    } finally {
      setPendingId(null)
    }
  }

  const chips: { key: keyof ClassFilters; label: string }[] = []
  if (filters.category) chips.push({ key: "category", label: filters.category })
  if (filters.teacherId) {
    chips.push({ key: "teacherId", label: options.teachers.find((t) => t.id === filters.teacherId)?.name ?? "" })
  }

  const title = mode === "month" ? formatMonthTitle(anchor) : formatWeekTitle(anchor)
  const nextLabel = mode === "month" ? `看 ${addMonths(anchor, 1).getMonth() + 1} 月` : "看下一週"
  const gridProps = {
    month: mode === "month" ? anchor : null,
    todayKey,
    selectedKey,
    dotKeys,
    onSelect: selectDay,
  }

  return (
    // --booking-top: where the sticky zone sits — under the mobile header, or the top of the md+ card.
    // overflow-anchor: none — the zone/spacer swap keeps layout stable; browser scroll anchoring would fight it.
    <div
      ref={root}
      className="relative [overflow-anchor:none] [--booking-top:calc(61px+env(safe-area-inset-top))] md:[--booking-top:0px]"
    >
      <div ref={zone} className="sticky top-(--booking-top) z-20 border-b border-neutral-200 bg-white">
        <BookingToolbar
          mode={mode}
          title={title}
          activeFilterCount={activeFilterCount}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onOpenFilters={() => setFilterOpen(true)}
          onModeChange={changeMode}
        />
        <AppliedFilters
          chips={chips}
          onRemove={(key) => applyFilters({ ...filters, [key]: null })}
          onClearAll={() => applyFilters(NO_FILTERS)}
        />
        <div className="grid h-7 grid-cols-7 px-2 text-center text-xs leading-7 text-muted-foreground">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="relative">
          <div ref={calendarViewport} className="overflow-hidden">
            <div ref={swipeTrack}>
              <CalendarGrid ref={calendarRows} weeks={weeks} {...gridProps} />
            </div>
          </div>
          {/* Collapsed: the whole month opens over the timeline without moving it. */}
          {overlayOpen && (
            <div className="absolute inset-x-0 top-0 z-20 bg-white shadow-[0_8px_16px_-8px_rgb(0_0_0/0.2)]">
              <CalendarGrid weeks={weeks} {...gridProps} />
              <CollapseHandle label="收合月曆" onClick={closeOverlay} />
            </div>
          )}
        </div>

        {/* Week view has no handle row, so give its dots some room above the zone's bottom border. */}
        {mode === "week" && <div aria-hidden className="h-3" />}
        {mode === "month" && (
          <div
            className={cn("transition-opacity motion-reduce:transition-none", !collapsed && "pointer-events-none")}
            style={{ opacity: "var(--collapse, 0)" }}
            aria-hidden={!collapsed}
          >
            <CollapseHandle label="展開月曆" onClick={() => setOverlayOpen((open) => !open)} />
          </div>
        )}

        {overlayOpen && (
          <button
            type="button"
            aria-label="收合月曆"
            onClick={closeOverlay}
            className="absolute inset-x-0 top-full h-dvh cursor-default bg-black/40"
          />
        )}
      </div>

      {/* Gives back the height the calendar loses while collapsing, so the timeline doesn't jump. */}
      <div ref={spacer} aria-hidden />

      <div className="px-4 lg:px-6">
        {days.map((day) => {
          const key = toKey(day)
          const entry = byDay.get(key)
          return (
            <TimelineDay
              key={key}
              day={day}
              isToday={key === todayKey}
              classes={(entry?.visible ?? []).map((gymClass) => ({ gymClass, action: classAction(gymClass, now) }))}
              emptyText={entry?.all && activeFilterCount ? "沒有符合篩選的課程" : "沒有排課"}
              pendingId={pendingId}
              onAction={runAction}
            />
          )
        })}
      </div>

      <div className="flex h-20 items-start justify-center pt-6">
        <button
          type="button"
          onClick={() => step(1)}
          className="h-10 self-start rounded-full border border-neutral-300 px-5 text-sm font-medium"
        >
          {nextLabel}
        </button>
      </div>

      <FilterPanel
        open={filterOpen}
        onOpenChange={setFilterOpen}
        applied={filters}
        categories={options.categories}
        teachers={options.teachers}
        rangeClasses={rangeClasses}
        onApply={applyFilters}
      />
    </div>
  )
}

function CollapseHandle({ label, onClick }: { label: string; onClick(): void }) {
  return (
    // Full-width 32px row: the bar is small, the tap target isn't.
    <button type="button" onClick={onClick} aria-label={label} className="flex h-8 w-full items-center justify-center">
      <span className="h-1 w-9 rounded-full bg-neutral-300" />
    </button>
  )
}
