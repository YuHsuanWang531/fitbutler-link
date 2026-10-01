import { cn } from "@/lib/utils"

type CarouselDotsProps = {
  count: number
  active: number
  onSelect: (index: number) => void
  inactiveClassName?: string
  label: string
}

export function CarouselDots({
  count,
  active,
  onSelect,
  inactiveClassName = "bg-neutral-400",
  label,
}: CarouselDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${label} ${i + 1}`}
          aria-current={i === active}
          onClick={() => onSelect(i)}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            i === active ? "bg-black" : inactiveClassName
          )}
        />
      ))}
    </div>
  )
}
