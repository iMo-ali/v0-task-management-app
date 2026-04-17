import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { createClient } from "@/lib/supabase/server"

export default async function SignUpPage() {
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
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center">
              <CheckCircle2 className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Tasker</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start managing your tasks in under a minute.
            </p>
          </div>
          <SignUpForm />
          <p className="mt-6 text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-foreground font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
