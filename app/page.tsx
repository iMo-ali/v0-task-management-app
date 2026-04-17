import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, Check, CircleDashed, Clock, Flame, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { BrandMark } from "@/components/brand-mark"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/tasks")
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-semibold tracking-tight text-lg">Tasker</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/auth/sign-up">
                Get started
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-7">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Quiet, focused task management
                </div>
                <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-balance">
                  Put your day
                  <br />
                  <span className="italic text-brand">in order.</span>
                </h1>
                <p className="mt-7 text-lg text-muted-foreground text-pretty leading-relaxed max-w-xl">
                  A calm, elegant task manager that keeps the things you need to do
                  within reach — and everything else out of the way.
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="gap-2 h-12 px-6 text-base">
                    <Link href="/auth/sign-up">
                      Create free account
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 text-base bg-card"
                  >
                    <Link href="/auth/login">I have an account</Link>
                  </Button>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">
                  Free forever. No credit card required.
                </p>
              </div>

              {/* Product preview card */}
              <div className="lg:col-span-5">
                <PreviewCard />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat value="3 sec" label="to add a task" />
            <Stat value="Zero" label="setup required" />
            <Stat value="100%" label="yours & private" />
            <Stat value="Always" label="free to use" />
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="max-w-2xl mb-14">
              <p className="text-sm font-medium text-brand uppercase tracking-wider mb-4">
                What&apos;s inside
              </p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance leading-[1.05]">
                Everything you need.
                <br />
                <span className="italic text-muted-foreground">Nothing you don&apos;t.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Feature
                icon={<ListTodo className="size-5" />}
                title="One clean list"
                description="No projects, boards, or labels to manage. Your tasks in a single, readable view — sorted by what matters most."
              />
              <Feature
                icon={<Flame className="size-5" />}
                title="Priority-first"
                description="Mark what matters with low, medium, or high priority. See the important stuff first, always."
              />
              <Feature
                icon={<Clock className="size-5" />}
                title="Deadlines made simple"
                description="Add a due date with a click. We'll remind you gently when something is due — no red-alert chaos."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24 text-center">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance leading-[1.05] max-w-2xl mx-auto">
              Your to-do list,{" "}
              <span className="italic text-brand">finally at peace.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
              Join thousands who&apos;ve traded chaos for clarity. It only takes a minute.
            </p>
            <Button asChild size="lg" className="mt-8 gap-2 h-12 px-7 text-base">
              <Link href="/auth/sign-up">
                Start for free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BrandMark size={20} />
            <span>
              Tasker &mdash; &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for people who get things done.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-serif text-3xl md:text-4xl text-foreground leading-none">
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-7 flex flex-col gap-3.5 transition-colors hover:border-foreground/20">
      <div className="size-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function PreviewCard() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 bg-gradient-to-br from-brand/10 to-transparent rounded-3xl blur-2xl"
      />
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">Today</span>
        </div>
        <div className="p-5 flex flex-col gap-2.5">
          <PreviewTask
            done
            title="Review Q4 roadmap draft"
            priority="low"
          />
          <PreviewTask
            title="Ship the new pricing page"
            priority="high"
            due="Today"
          />
          <PreviewTask
            title="Call with the design team"
            priority="medium"
            due="Tomorrow"
          />
          <PreviewTask
            title="Write release notes"
            priority="medium"
          />
          <PreviewTask
            title="Reply to Sarah about brand book"
            priority="low"
            due="Fri"
          />
        </div>
      </div>
    </div>
  )
}

function PreviewTask({
  title,
  priority,
  due,
  done = false,
}: {
  title: string
  priority: "low" | "medium" | "high"
  due?: string
  done?: boolean
}) {
  const dotColor = {
    low: "bg-muted-foreground/40",
    medium: "bg-foreground/60",
    high: "bg-brand",
  }[priority]

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors">
      <div
        className={`size-4 rounded-md border-2 flex items-center justify-center shrink-0 ${
          done
            ? "bg-foreground border-foreground"
            : "border-border bg-background"
        }`}
      >
        {done ? (
          <Check className="size-2.5 text-background" strokeWidth={3} />
        ) : null}
      </div>
      <span className={`size-1.5 rounded-full ${dotColor} shrink-0`} />
      <p
        className={`text-sm flex-1 truncate ${
          done ? "line-through text-muted-foreground" : "text-foreground"
        }`}
      >
        {title}
      </p>
      {due ? (
        <span
          className={`text-xs shrink-0 ${
            due === "Today" ? "text-brand font-medium" : "text-muted-foreground"
          }`}
        >
          {due}
        </span>
      ) : null}
    </div>
  )
}
