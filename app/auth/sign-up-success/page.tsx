import Link from "next/link"
import { CheckCircle2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
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
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto size-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-6">
            <MailCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            We sent you a confirmation link. Click it to activate your account, then log in to
            start managing your tasks.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/auth/login">Back to log in</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
