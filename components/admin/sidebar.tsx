"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  FileText,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  ArrowRightLeft,
  Building2,
} from "lucide-react"
import { RoleGuard } from "@/components/auth/role-guard"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Warehouses", href: "/admin/warehouses", icon: Warehouse },
  { name: "Inventory", href: "/admin/inventory", icon: BarChart3 },
  { name: "Stock Transfers", href: "/admin/transfers", icon: ArrowRightLeft },
  { name: "Customers", href: "/admin/customers", icon: Building2 },
  { name: "Sales Invoices", href: "/admin/invoices", icon: FileText },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
]

const adminNavigation = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Inventory System</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome, {session?.user?.name}</p>
      </div>

      <nav className="px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        <RoleGuard allowedRoles={["ADMIN"]}>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors mt-1",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </RoleGuard>
      </nav>
    </div>
  )
}
