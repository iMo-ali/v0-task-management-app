import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
          <div className="mx-auto size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-7">
            <AlertTriangle className="size-7" />
          </div>
          <h1 className="font-serif text-4xl tracking-tight leading-tight">
            Something went wrong.
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {params?.error
              ? `Error: ${params.error}`
              : "An unexpected error occurred while signing you in."}
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Try again</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
