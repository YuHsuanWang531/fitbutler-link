"use client"

import { Select } from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export type DropdownOption = { value: string; label: string }

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
  className?: string
}) {
  const picked = options.find((o) => o.value === value)

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
          "flex h-11 w-full items-center gap-2 rounded-[10px] border bg-white pr-4 pl-4 text-left text-sm outline-none disabled:bg-neutral-50",
          invalid ? "border-destructive" : "border-neutral-200",
          !picked && "text-neutral-500",
          className
        )}
      >
        <Select.Value className="min-w-0 flex-1 truncate">{() => picked?.label ?? placeholder}</Select.Value>
        <Select.Icon className="shrink-0 text-neutral-500">
          <ChevronDown aria-hidden className="size-5" strokeWidth={1.5} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={9} alignItemWithTrigger={false} className="z-[60] outline-none">
          <Select.Popup className="max-h-[min(266px,var(--available-height))] w-[var(--anchor-width)] overflow-y-auto overscroll-contain rounded-[10px] border border-neutral-200 bg-white text-sm text-black outline-none">
            {options.map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                className="flex min-h-11 cursor-pointer items-center gap-2 border-b border-neutral-200 px-4 py-2.5 outline-none select-none last:border-b-0 hover:bg-neutral-50 focus-visible:bg-neutral-50 active:bg-neutral-50"
              >
                <Select.ItemText className="min-w-0 flex-1">{o.label}</Select.ItemText>
                <Select.ItemIndicator className="shrink-0">
                  <Check aria-hidden className="size-4" strokeWidth={2} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
