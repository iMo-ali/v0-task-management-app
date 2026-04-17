import { cn } from "@/lib/utils"

export function BrandMark({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-md bg-foreground text-background flex items-center justify-center font-serif leading-none relative shrink-0",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span style={{ fontSize: size * 0.6 }} className="translate-y-[1px]">
        T
      </span>
      <span
        className="absolute -top-0.5 -right-0.5 rounded-full bg-brand"
        style={{ width: size * 0.28, height: size * 0.28 }}
      />
    </div>
  )
}
