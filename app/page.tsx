import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, CheckCircle2, ListTodo, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/tasks")
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center">
              <CheckCircle2 className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Tasker</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="size-1.5 rounded-full bg-primary" />
              Built for focused work
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance leading-tight">
              A task manager that stays out of your way.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl">
              Capture what needs doing, set a priority, and move on. No projects, no kanban, no
              distractions. Just your tasks, organized by what matters now.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/auth/sign-up">
                  Create free account <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Log in</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid md:grid-cols-3 gap-8">
              <Feature
                icon={<ListTodo className="size-5" />}
                title="Simple task list"
                description="One view. Clean table. Status, priority, and due date at a glance."
              />
              <Feature
                icon={<Zap className="size-5" />}
                title="Fast by default"
                description="Add, edit, and complete tasks in seconds. Keyboard-friendly throughout."
              />
              <Feature
                icon={<Shield className="size-5" />}
                title="Private and secure"
                description="Your tasks are stored in a secure database. Only you can see them."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground">
          Tasker &copy; {new Date().getFullYear()}
        </div>
      </footer>
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
    <div className="flex flex-col gap-3">
      <div className="size-10 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
