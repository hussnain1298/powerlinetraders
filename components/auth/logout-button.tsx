"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
}

export function LogoutButton({ variant = "ghost", size = "default" }: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
}
