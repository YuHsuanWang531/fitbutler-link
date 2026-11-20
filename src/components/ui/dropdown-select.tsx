"use client"

import { Select } from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/** `description`: a grey 12px second line (e.g. 使用會籍's 剩 N 堂｜至 date), shown in the list and the trigger. */
export type DropdownOption = { value: string; label: string; description?: string }

/**
 * The site's 下拉選單: a grey-bordered trigger, and 9px below it a separate list of options split by lines, as tall as
 * six options at most (the rest scroll). An option turns grey while hovered or pressed; the picked one has a ✓.
 * `value` "" means nothing picked (shows the placeholder), unless an option itself has the value "" (like 不限).
 */
export function DropdownSelect({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  invalid,
  disabled,
  describedBy,
  size = "default",
  className,
}: {
  id?: string
  /** Accessible name when there's no visible <label htmlFor={id}>. */
  label?: string
  placeholder?: string
  options: DropdownOption[]
  value: string
  onChange(value: string): void
  invalid?: boolean
  disabled?: boolean
  describedBy?: string
  /**
   * "sm": 32px tall, for compact headers like the calendar's 月／年. "pill": the 28px rounded 場館 pill next to a page
   * title, its list as wide as the options need (at least the pill) and 4px below it.
   */
  size?: "default" | "sm" | "pill"
  className?: string
}) {
  const picked = options.find((o) => o.value === value)
  // Two-line options (Figma 使用會籍): 4px 16px rows, the list 4px under the trigger.
  const twoLine = options.some((o) => o.description)
  const pill = size === "pill"

  return (
    <Select.Root
      value={picked ? picked.value : null}
      onValueChange={(v) => onChange((v as string | null) ?? "")}
      disabled={disabled}
    >
      <Select.Trigger
        id={id}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          "flex items-center border bg-white text-left text-sm outline-none disabled:bg-neutral-50",
          pill
            ? "h-7 max-w-[180px] gap-0.5 rounded-full px-2 text-black hover:bg-neutral-100"
            : cn(
                "w-full rounded-[10px]",
                size === "sm" ? "h-8 gap-1.5 px-2" : twoLine ? "min-h-11 gap-2 px-4 py-1" : "h-11 gap-2 px-4"
              ),
          invalid ? "border-destructive" : "border-neutral-200",
          !picked && "text-neutral-500",
          className
        )}
      >
        <Select.Value className="flex min-w-0 flex-1 flex-col">
          {() => (
            <>
              <span className="truncate">{picked?.label ?? placeholder}</span>
              {picked?.description && (
                <span className="truncate text-xs leading-4 text-muted-foreground">{picked.description}</span>
              )}
            </>
          )}
        </Select.Value>
        <Select.Icon className={cn("shrink-0", !pill && "text-neutral-500")}>
          <ChevronDown aria-hidden className={size === "default" ? "size-5" : "size-4"} strokeWidth={pill ? 2 : 1.5} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          sideOffset={twoLine || pill ? 4 : 9}
          align="start"
          alignItemWithTrigger={false}
          className="z-[60] outline-none"
        >
          <Select.Popup
            className={cn(
              "max-h-[min(266px,var(--available-height))] overflow-y-auto overscroll-contain rounded-[10px] border border-neutral-200 bg-white text-sm text-black outline-none",
              pill ? "w-max max-w-[calc(100vw-32px)] min-w-[var(--anchor-width)]" : "w-[var(--anchor-width)]"
            )}
          >
            {options.map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                className={cn(
                  "flex cursor-pointer items-center gap-2 border-b border-neutral-200 px-4 outline-none select-none last:border-b-0 hover:bg-neutral-50 focus-visible:bg-neutral-50 active:bg-neutral-50",
                  twoLine ? "py-1" : "min-h-11 py-2.5",
                  pill && "gap-6"
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <Select.ItemText>{o.label}</Select.ItemText>
                  {o.description && <span className="text-xs leading-4 text-muted-foreground">{o.description}</span>}
                </div>
                <Select.ItemIndicator className="shrink-0">
                  <Check aria-hidden className={twoLine ? "size-5" : "size-4"} strokeWidth={twoLine ? 1.5 : 2} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
