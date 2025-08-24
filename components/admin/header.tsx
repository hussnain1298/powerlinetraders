"use client"

import { useSession } from "next-auth/react"
import { LogoutButton } from "@/components/auth/logout-button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { data: session } = useSession()

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "MANAGER":
        return "default"
      case "STAFF":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{session?.user?.email}</span>
            <Badge variant={getRoleBadgeVariant(session?.user?.role || "")}>{session?.user?.role}</Badge>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
