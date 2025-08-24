import type { User, Role } from "@prisma/client"

export type AuthUser = Pick<User, "id" | "name" | "email" | "role">

// Role-based access control helper
export function can(user: AuthUser | null, action: string): boolean {
  if (!user) return false

  const permissions: Record<string, Role[]> = {
    "user:manage": ["ADMIN"],
    "user:read": ["ADMIN", "MANAGER"],
    "product:write": ["ADMIN", "MANAGER"],
    "product:read": ["ADMIN", "MANAGER", "STAFF"],
    "warehouse:write": ["ADMIN", "MANAGER"],
    "warehouse:read": ["ADMIN", "MANAGER", "STAFF"],
    "stock:transfer": ["ADMIN", "MANAGER"],
    "stock:read": ["ADMIN", "MANAGER", "STAFF"],
    "purchase:write": ["ADMIN", "MANAGER"],
    "purchase:read": ["ADMIN", "MANAGER", "STAFF"],
    "invoice:write": ["ADMIN", "MANAGER"],
    "invoice:post": ["ADMIN", "MANAGER"],
    "invoice:read": ["ADMIN", "MANAGER", "STAFF"],
    "inquiry:read": ["ADMIN", "MANAGER"],
  }

  const allowedRoles = permissions[action] || []
  return allowedRoles.includes(user.role)
}

// Hash password utility (you'll need to install bcryptjs)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.hash(password, 12)
}

// Verify password utility
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const bcrypt = await import("bcryptjs")
    const result = await bcrypt.compare(password, hashedPassword)
    console.log("[v0] Password verification result:", result)
    return result
  } catch (error) {
    console.error("[v0] Password verification error:", error)
    return false
  }
}
