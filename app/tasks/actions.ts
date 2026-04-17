"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export type Task = {
  id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  created_at: string
  updated_at: string
}

function parseDate(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

function parseText(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

export async function createTaskAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const title = parseText(formData.get("title"))
  if (!title) {
    return { error: "Title is required" }
  }

  const description = parseText(formData.get("description"))
  const status = (formData.get("status") as TaskStatus | null) ?? "todo"
  const priority = (formData.get("priority") as TaskPriority | null) ?? "medium"
  const due_date = parseDate(formData.get("due_date"))

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    description,
    status,
    priority,
    due_date,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/tasks")
  return { error: null }
}

export async function updateTaskAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const title = parseText(formData.get("title"))
  if (!title) {
    return { error: "Title is required" }
  }

  const description = parseText(formData.get("description"))
  const status = (formData.get("status") as TaskStatus | null) ?? "todo"
  const priority = (formData.get("priority") as TaskPriority | null) ?? "medium"
  const due_date = parseDate(formData.get("due_date"))

  const { error } = await supabase
    .from("tasks")
    .update({ title, description, status, priority, due_date })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/tasks")
  return { error: null }
}

export async function updateTaskStatusAction(id: string, status: TaskStatus) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/tasks")
  return { error: null }
}

export async function deleteTaskAction(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/tasks")
  return { error: null }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
