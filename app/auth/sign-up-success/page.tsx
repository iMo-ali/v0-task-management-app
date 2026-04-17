import Link from "next/link"
import { MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <BrandMark />
            <span className="font-semibold tracking-tight text-lg">Tasker</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto size-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-7">
            <MailCheck className="size-7" />
          </div>
          <h1 className="font-serif text-4xl tracking-tight leading-tight">
            Check your email.
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We sent you a confirmation link. Click it to activate your account,
            then log in to start organizing your day.
          </p>
          <Button asChild className="mt-8 w-full h-11">
            <Link href="/auth/login">Back to log in</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
