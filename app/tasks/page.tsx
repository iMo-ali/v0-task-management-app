import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { TasksView } from "@/components/tasks/tasks-view"
import { UserMenu } from "@/components/tasks/user-menu"
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

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-border sticky top-0 z-10 bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/tasks" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center">
              <CheckCircle2 className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Tasker</span>
          </Link>
          <UserMenu email={user.email ?? ""} name={userName} />
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back, {userName.split(" ")[0]}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {tasks && tasks.length > 0
                ? `You have ${tasks.filter((t: Task) => t.status !== "done").length} open ${
                    tasks.filter((t: Task) => t.status !== "done").length === 1
                      ? "task"
                      : "tasks"
                  }.`
                : "Get started by adding your first task."}
            </p>
          </div>

          <TasksView tasks={(tasks as Task[]) ?? []} />
        </div>
      </main>
    </div>
  )
}
