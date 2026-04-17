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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All <span className="text-muted-foreground text-xs">{counts.all}</span>
            </TabsTrigger>
            <TabsTrigger value="open" className="gap-2">
              Open <span className="text-muted-foreground text-xs">{counts.open}</span>
            </TabsTrigger>
            <TabsTrigger value="done" className="gap-2">
              Done <span className="text-muted-foreground text-xs">{counts.done}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
          <Button onClick={openNewTask} className="gap-2 shrink-0">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New task</span>
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty className="border rounded-lg">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodo />
            </EmptyMedia>
            <EmptyTitle>
              {tasks.length === 0 ? "No tasks yet" : "Nothing matches your filters"}
            </EmptyTitle>
            <EmptyDescription>
              {tasks.length === 0
                ? "Add your first task to get started."
                : "Try adjusting your search or switching tabs."}
            </EmptyDescription>
          </EmptyHeader>
          {tasks.length === 0 ? (
            <EmptyContent>
              <Button onClick={openNewTask} className="gap-2">
                <Plus className="size-4" />
                New task
              </Button>
            </EmptyContent>
          ) : null}
        </Empty>
      ) : (
        <ul className="flex flex-col gap-2">
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
              {deleteTarget ? `"${deleteTarget.title}" will be permanently deleted.` : ""}
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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

  return (
    <li
      className={cn(
        "group flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors",
        "hover:border-ring/40",
      )}
    >
      <Checkbox
        checked={isDone}
        onCheckedChange={onToggle}
        className="mt-1"
        aria-label={isDone ? "Mark as not done" : "Mark as done"}
      />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "font-medium text-sm leading-6 break-words",
              isDone && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </p>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {task.description ? (
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed break-words">
            {task.description}
          </p>
        ) : null}

        {task.due_date ? (
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <span>Due {formatDate(task.due_date)}</span>
          </div>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            aria-label="Task actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onEdit} className="cursor-pointer">
            <Pencil className="size-4" />
            <span>Edit</span>
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

function StatusBadge({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <Badge variant="secondary" className="gap-1 font-normal">
        <Check className="size-3" /> Done
      </Badge>
    )
  }
  if (status === "in_progress") {
    return (
      <Badge variant="secondary" className="gap-1 font-normal bg-accent text-accent-foreground">
        <Clock className="size-3" /> In progress
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 font-normal">
      <CircleDashed className="size-3" /> To do
    </Badge>
  )
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, string> = {
    low: "text-muted-foreground",
    medium: "text-foreground",
    high: "text-destructive",
  }
  const dotStyles: Record<TaskPriority, string> = {
    low: "bg-muted-foreground/60",
    medium: "bg-primary",
    high: "bg-destructive",
  }
  const labels: Record<TaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-xs font-normal",
        styles[priority],
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[priority])} />
      {labels[priority]}
    </span>
  )
}

function formatDate(iso: string) {
  const date = new Date(iso + "T00:00:00")
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  })
}
