"use client"

import { useSession } from "next-auth/react"
import type { Role } from "@prisma/client"
import type { ReactNode } from "react"

interface RoleGuardProps {
  allowedRoles: Role[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session?.user || !allowedRoles.includes(session.user.role as Role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
