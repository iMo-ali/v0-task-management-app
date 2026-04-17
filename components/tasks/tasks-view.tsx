"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  CalendarDays,
  Check,
  CircleDashed,
  Clock,
  ListTodo,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { TaskFormDialog } from "./task-form-dialog"
import {
  deleteTaskAction,
  updateTaskStatusAction,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/app/tasks/actions"
import { cn } from "@/lib/utils"

type Filter = "all" | "open" | "done"

export function TasksView({ tasks }: { tasks: Task[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)

  const counts = useMemo(
    () => ({
      all: tasks.length,
      open: tasks.filter((t) => t.status !== "done").length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks.filter((t) => {
      if (filter === "open" && t.status === "done") return false
      if (filter === "done" && t.status !== "done") return false
      if (q) {
        const haystack = `${t.title} ${t.description ?? ""}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [tasks, filter, query])

  function openNewTask() {
    setEditingTask(null)
    setDialogOpen(true)
  }

  function openEditTask(task: Task) {
    setEditingTask(task)
    setDialogOpen(true)
  }

  function toggleDone(task: Task) {
    const next: TaskStatus = task.status === "done" ? "todo" : "done"
    startTransition(async () => {
      const result = await updateTaskStatusAction(task.id, next)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    startTransition(async () => {
      const result = await deleteTaskAction(target.id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Task deleted")
      setDeleteTarget(null)
      router.refresh()
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 md:p-5 border-b border-border">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60 self-start">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            count={counts.all}
          >
            All
          </FilterPill>
          <FilterPill
            active={filter === "open"}
            onClick={() => setFilter("open")}
            count={counts.open}
          >
            Open
          </FilterPill>
          <FilterPill
            active={filter === "done"}
            onClick={() => setFilter("done")}
            count={counts.done}
          >
            Done
          </FilterPill>
        </div>

        <div className="flex gap-2">
          <InputGroup className="w-full sm:w-64">
            <InputGroupAddon>
              <Search className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tasks"
            />
          </InputGroup>
          <Button onClick={openNewTask} className="gap-2 shrink-0 h-10">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New task</span>
          </Button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Empty className="p-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodo />
            </EmptyMedia>
            <EmptyTitle>
              {tasks.length === 0 ? "A clean slate." : "Nothing matches."}
            </EmptyTitle>
            <EmptyDescription>
              {tasks.length === 0
                ? "Add your first task to get started."
                : "Try a different search or filter."}
            </EmptyDescription>
          </EmptyHeader>
          {tasks.length === 0 ? (
            <EmptyContent>
              <Button onClick={openNewTask} className="gap-2">
                <Plus className="size-4" />
                Add your first task
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleDone(task)}
              onEdit={() => openEditTask(task)}
              onDelete={() => setDeleteTarget(task)}
            />
          ))}
        </ul>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `"${deleteTarget.title}" will be permanently deleted.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      <span
        className={cn(
          "text-xs tabular-nums",
          active ? "text-muted-foreground" : "text-muted-foreground/70",
        )}
      >
        {count}
      </span>
    </button>
  )
}

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const isDone = task.status === "done"
  const dueInfo = task.due_date ? getDueInfo(task.due_date) : null

  return (
    <li className="group relative flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
      {/* Priority stripe */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full",
          priorityStripe(task.priority, isDone),
        )}
      />

      {/* Checkbox */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isDone ? "Mark as not done" : "Mark as done"}
        className={cn(
          "mt-0.5 size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
          isDone
            ? "bg-foreground border-foreground"
            : "border-border bg-background hover:border-foreground/50",
        )}
      >
        {isDone ? (
          <Check className="size-3 text-background" strokeWidth={3} />
        ) : null}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2">
          <button
            type="button"
            onClick={onEdit}
            className={cn(
              "text-left font-medium leading-6 break-words hover:text-brand transition-colors",
              isDone && "line-through text-muted-foreground hover:text-muted-foreground",
            )}
          >
            {task.title}
          </button>
        </div>

        {task.description ? (
          <p
            className={cn(
              "mt-1 text-sm text-muted-foreground leading-relaxed break-words line-clamp-2",
              isDone && "line-through",
            )}
          >
            {task.description}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <StatusChip status={task.status} />
          <PriorityChip priority={task.priority} />
          {dueInfo ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-medium",
                isDone
                  ? "text-muted-foreground line-through"
                  : dueInfo.tone === "overdue"
                  ? "text-destructive"
                  : dueInfo.tone === "today"
                  ? "text-brand"
                  : "text-muted-foreground",
              )}
            >
              <CalendarDays className="size-3.5" />
              {dueInfo.label}
            </span>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 transition-opacity"
            aria-label="Task actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onEdit} className="cursor-pointer">
            <Pencil className="size-4" />
            <span>Edit task</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onToggle} className="cursor-pointer">
            <Check className="size-4" />
            <span>{isDone ? "Mark as open" : "Mark as done"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={onDelete}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

function priorityStripe(priority: TaskPriority, isDone: boolean) {
  if (isDone) return "bg-transparent"
  return {
    low: "bg-transparent",
    medium: "bg-foreground/40",
    high: "bg-brand",
  }[priority]
}

function StatusChip({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Check className="size-3.5" />
        Done
      </span>
    )
  }
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 text-accent-foreground">
        <Clock className="size-3.5" />
        In progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <CircleDashed className="size-3.5" />
      To do
    </span>
  )
}

function PriorityChip({ priority }: { priority: TaskPriority }) {
  const config = {
    low: {
      label: "Low",
      dot: "bg-muted-foreground/50",
      text: "text-muted-foreground",
    },
    medium: {
      label: "Medium",
      dot: "bg-foreground/60",
      text: "text-muted-foreground",
    },
    high: {
      label: "High",
      dot: "bg-brand",
      text: "text-brand",
    },
  }[priority]

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-medium", config.text)}>
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  )
}

function getDueInfo(iso: string): {
  label: string
  tone: "overdue" | "today" | "upcoming"
} {
  const date = new Date(iso + "T00:00:00")
  if (Number.isNaN(date.getTime())) return { label: iso, tone: "upcoming" }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffMs = date.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    const days = Math.abs(diffDays)
    return {
      label: `Overdue by ${days} ${days === 1 ? "day" : "days"}`,
      tone: "overdue",
    }
  }
  if (diffDays === 0) return { label: "Due today", tone: "today" }
  if (diffDays === 1) return { label: "Due tomorrow", tone: "upcoming" }
  if (diffDays < 7)
    return {
      label: `Due ${date.toLocaleDateString(undefined, { weekday: "long" })}`,
      tone: "upcoming",
    }

  return {
    label: `Due ${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() === today.getFullYear() ? undefined : "numeric",
    })}`,
    tone: "upcoming",
  }
}
