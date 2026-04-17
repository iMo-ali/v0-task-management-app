"use client"

import { useTransition } from "react"
import { LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/tasks/actions"

export function UserMenu({ email, name }: { email: string; name: string }) {
  const [pending, startTransition] = useTransition()

  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-2 gap-2.5 rounded-full hover:bg-muted"
          aria-label="Open user menu"
        >
          <span className="size-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium tracking-wide">
            {initials}
          </span>
          <span className="hidden sm:inline text-sm font-medium max-w-[140px] truncate">
            {name.split(" ")[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <User className="size-4 text-muted-foreground" />
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-medium">{name}</span>
            {email ? (
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          onSelect={(e) => {
            e.preventDefault()
            startTransition(() => {
              signOutAction()
            })
          }}
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>{pending ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
