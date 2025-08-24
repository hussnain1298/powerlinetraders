"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Warehouse, FileText, Users } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()

  const stats = [
    {
      title: "Total Products",
      value: "15",
      description: "Active products in inventory",
      icon: Package,
    },
    {
      title: "Warehouses",
      value: "3",
      description: "Storage locations",
      icon: Warehouse,
    },
    {
      title: "Sales Invoices",
      value: "8",
      description: "This month",
      icon: FileText,
    },
    {
      title: "Customers",
      value: "12",
      description: "Active customers",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Stock transfer: Generator Belt → Main Warehouse</span>
                <span className="text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>New invoice created: INV-000008</span>
                <span className="text-muted-foreground">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Customer inquiry received from ABC Corp</span>
                <span className="text-muted-foreground">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Products below minimum stock level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Generator Belt (GB-001)</span>
                <span className="text-red-600 font-medium">2 units left</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Oil Filter (OF-125)</span>
                <span className="text-red-600 font-medium">5 units left</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
