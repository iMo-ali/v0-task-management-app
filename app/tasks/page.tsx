import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TasksView } from "@/components/tasks/tasks-view"
import { UserMenu } from "@/components/tasks/user-menu"
import { BrandMark } from "@/components/brand-mark"
import type { Task } from "./actions"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const userName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "there"
  const firstName = userName.split(" ")[0]

  const allTasks = (tasks as Task[]) ?? []
  const openCount = allTasks.filter((t) => t.status !== "done").length
  const doneCount = allTasks.filter((t) => t.status === "done").length
  const highCount = allTasks.filter(
    (t) => t.priority === "high" && t.status !== "done",
  ).length

  const today = new Date()
  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 18
      ? "Good afternoon"
      : "Good evening"

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="border-b border-border sticky top-0 z-20 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/tasks" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-semibold tracking-tight text-lg">Tasker</span>
          </Link>
          <UserMenu email={user.email ?? ""} name={userName} />
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          {/* Hero */}
          <div className="mb-10 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.05]">
              {greeting}, <span className="italic text-brand">{firstName}</span>.
            </h1>
            <p className="text-muted-foreground text-pretty max-w-xl leading-relaxed">
              {allTasks.length === 0
                ? "You don't have any tasks yet. Let's add your first one."
                : openCount === 0
                ? "You're all caught up. Take a breath."
                : `You have ${openCount} open ${openCount === 1 ? "task" : "tasks"}${
                    highCount > 0
                      ? ` — ${highCount} marked as high priority.`
                      : "."
                  }`}
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <StatCard
              label="Open"
              value={openCount}
              tone="default"
            />
            <StatCard
              label="High priority"
              value={highCount}
              tone="brand"
            />
            <StatCard
              label="Completed"
              value={doneCount}
              tone="muted"
            />
          </div>

          <TasksView tasks={allTasks} />
        </div>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "default" | "brand" | "muted"
}) {
  const toneClasses = {
    default: "bg-card border-border",
    brand: "bg-accent border-accent",
    muted: "bg-muted/50 border-border",
  }[tone]
  const valueClasses = {
    default: "text-foreground",
    brand: "text-accent-foreground",
    muted: "text-muted-foreground",
  }[tone]
  return (
    <div
      className={`rounded-xl border p-4 md:p-5 flex flex-col gap-1 ${toneClasses}`}
    >
      <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className={`font-serif text-3xl md:text-4xl leading-none ${valueClasses}`}>
        {value}
      </p>
    </div>
  )
}
