"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  createTaskAction,
  updateTaskAction,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/app/tasks/actions"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
}

export function TaskFormDialog({ open, onOpenChange, task }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("todo")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "")
      setDescription(task?.description ?? "")
      setStatus(task?.status ?? "todo")
      setPriority(task?.priority ?? "medium")
      setDueDate(task?.due_date ?? "")
    }
  }, [open, task])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData()
    formData.set("title", title)
    formData.set("description", description)
    formData.set("status", status)
    formData.set("priority", priority)
    formData.set("due_date", dueDate)

    startTransition(async () => {
      const result = task
        ? await updateTaskAction(task.id, formData)
        : await createTaskAction(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(task ? "Task updated" : "Task added")
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-tight">
            {task ? "Edit task" : "New task"}
          </DialogTitle>
          <DialogDescription>
            {task
              ? "Update the details of your task."
              : "Something on your mind? Capture it here."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              required
              maxLength={200}
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="h-11 text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Add any details, notes, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger id="status" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To do</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TaskPriority)}
              >
                <SelectTrigger id="priority" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-foreground/60" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-brand" />
                      High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="due_date" className="text-sm font-medium">
              Due date{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Spinner className="size-4" />{" "}
                  {task ? "Saving..." : "Adding..."}
                </>
              ) : task ? (
                "Save changes"
              ) : (
                "Add task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
