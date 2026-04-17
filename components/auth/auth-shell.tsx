import Link from "next/link"
import { Quote } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-background">
      {/* Left: form */}
      <div className="flex flex-col">
        <header className="px-6 md:px-10 py-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <BrandMark />
            <span className="font-semibold tracking-tight text-lg">Tasker</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 md:px-10 pb-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.05]">
                {title}
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>
            </div>
            {children}
            <div className="mt-8 text-sm text-muted-foreground text-center">
              {footer}
            </div>
          </div>
        </main>
      </div>

      {/* Right: marketing panel (hidden on mobile) */}
      <div className="hidden lg:block relative bg-foreground text-background overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-40 -right-40 size-[480px] rounded-full bg-brand/30 blur-3xl"
        />
        <div className="relative h-full flex flex-col justify-between p-12">
          <div className="flex items-center gap-2 text-sm opacity-70">
            <span className="size-1.5 rounded-full bg-brand" />
            Calm by design
          </div>

          <div className="max-w-md">
            <Quote className="size-8 text-brand mb-6" />
            <p className="font-serif text-3xl leading-snug text-balance">
              &ldquo;I finally stopped losing track of what mattered.
              <span className="italic text-background/70">
                {" "}
                Everything lives in one place.&rdquo;
              </span>
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="size-10 rounded-full bg-brand/20 flex items-center justify-center font-medium text-background">
                MR
              </div>
              <div>
                <p className="font-medium">Maya Reyes</p>
                <p className="text-sm opacity-60">Product designer</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-serif text-2xl text-brand">12k+</p>
              <p className="opacity-70 mt-1">Lists organized</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-brand">4.9</p>
              <p className="opacity-70 mt-1">Customer rating</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-brand">0 ads</p>
              <p className="opacity-70 mt-1">Now & forever</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
