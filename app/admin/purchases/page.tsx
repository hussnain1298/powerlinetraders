"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Package } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"
import { format } from "date-fns"

interface PurchaseOrder {
  id: string
  poNumber: string
  supplierName: string
  warehouseName: string
  status: string
  createdAt: string
  createdByName: string | null
  itemCount: number
  totalValue: number
}

export default function PurchasesPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPurchaseOrders()
  }, [])

  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch("/api/admin/purchase-orders")
      if (response.ok) {
        const data = await response.json()
        setPurchaseOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch purchase orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPurchaseOrders = purchaseOrders.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "default"
      case "RECEIVED":
        return "secondary"
      case "CLOSED":
        return "outline"
      default:
        return "outline"
    }
  }

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
          <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage purchase orders and inventory receiving</p>
        </div>
        <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
          <Button asChild>
            <Link href="/admin/purchases/new">
              <Plus className="mr-2 h-4 w-4" />
              New Purchase Order
            </Link>
          </Button>
        </RoleGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Order List</CardTitle>
          <CardDescription>View and manage all purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by PO number or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredPurchaseOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No purchase orders found</p>
              </div>
            ) : (
              filteredPurchaseOrders.map((po) => (
                <div key={po.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{po.poNumber}</h3>
                      <Badge variant={getStatusColor(po.status)}>{po.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span>Supplier: {po.supplierName}</span>
                      <span>Warehouse: {po.warehouseName}</span>
                      <span>Items: {po.itemCount}</span>
                      <span>Total: ${po.totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>Created: {format(new Date(po.createdAt), "MMM dd, yyyy")}</span>
                      {po.createdByName && <span>By: {po.createdByName}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/purchases/${po.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
                      {po.status === "OPEN" && (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/purchases/${po.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/purchases/${po.id}/receive`}>
                              <Package className="h-4 w-4" />
                            </Link>
                          </Button>
                        </>
                      )}
                    </RoleGuard>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
