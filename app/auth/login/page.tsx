import Link from "next/link"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { AuthShell } from "@/components/auth/auth-shell"
import { createClient } from "@/lib/supabase/server"

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/tasks")
  }

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link
            href="/auth/sign-up"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
