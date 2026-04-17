import Link from "next/link"
import { redirect } from "next/navigation"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { AuthShell } from "@/components/auth/auth-shell"
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
    <AuthShell
      title="Create your account."
      subtitle="Start organizing your day in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Log in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  )
}
