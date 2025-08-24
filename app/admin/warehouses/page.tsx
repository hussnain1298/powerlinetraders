"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"

interface Warehouse {
  id: string
  code: string
  name: string
  address: string | null
  isActive: boolean
  createdAt: string
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch("/api/admin/warehouses")
      if (response.ok) {
        const data = await response.json()
        setWarehouses(data)
      }
    } catch (error) {
      console.error("Failed to fetch warehouses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Warehouses</h1>
          <p className="text-muted-foreground">Manage your storage locations</p>
        </div>
        <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
          <Button asChild>
            <Link href="/admin/warehouses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Warehouse
            </Link>
          </Button>
        </RoleGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse List</CardTitle>
          <CardDescription>View and manage all warehouse locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredWarehouses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No warehouses found</p>
              </div>
            ) : (
              filteredWarehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{warehouse.name}</h3>
                        <p className="text-sm text-muted-foreground">Code: {warehouse.code}</p>
                      </div>
                      <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                        {warehouse.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {warehouse.address && (
                      <div className="flex items-center space-x-1 mt-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{warehouse.address}</p>
                      </div>
                    )}
                  </div>
                  <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/warehouses/${warehouse.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </RoleGuard>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
