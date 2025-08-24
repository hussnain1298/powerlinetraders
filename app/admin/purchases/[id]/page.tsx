"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Package, Calendar, User, MapPin } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"
import { format } from "date-fns"

interface PurchaseOrderItem {
  id: string
  productName: string
  productSku: string
  qty: number
  unitCost: number
  taxRate: number
  lineTotal: number
}

interface PurchaseOrderDetail {
  id: string
  poNumber: string
  supplierName: string
  supplierEmail: string | null
  supplierPhone: string | null
  warehouseName: string
  warehouseAddress: string | null
  status: string
  notes: string | null
  createdAt: string
  createdByName: string | null
  items: PurchaseOrderItem[]
  subTotal: number
  taxTotal: number
  grandTotal: number
}

export default function PurchaseOrderDetailPage() {
  const params = useParams()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPurchaseOrder(params.id as string)
    }
  }, [params.id])

  const fetchPurchaseOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/purchase-orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPurchaseOrder(data)
      }
    } catch (error) {
      console.error("Failed to fetch purchase order:", error)
    } finally {
      setLoading(false)
    }
  }

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

  if (!purchaseOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Purchase order not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/purchases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchase Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{purchaseOrder.poNumber}</h1>
            <p className="text-muted-foreground">Purchase order details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(purchaseOrder.status)}>{purchaseOrder.status}</Badge>
          <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
            {purchaseOrder.status === "OPEN" && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/purchases/${purchaseOrder.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/admin/purchases/${purchaseOrder.id}/receive`}>
                    <Package className="mr-2 h-4 w-4" />
                    Receive Items
                  </Link>
                </Button>
              </>
            )}
          </RoleGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Products included in this purchase order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.productSku}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-4 text-sm">
                        <span>Qty: {item.qty}</span>
                        <span>@ ${item.unitCost.toFixed(2)}</span>
                        {item.taxRate > 0 && <span>Tax: {item.taxRate}%</span>}
                      </div>
                      <p className="font-semibold">${item.lineTotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${purchaseOrder.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${purchaseOrder.taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${purchaseOrder.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {purchaseOrder.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{purchaseOrder.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-foreground">{purchaseOrder.supplierName}</p>
              </div>
              {purchaseOrder.supplierEmail && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Email: {purchaseOrder.supplierEmail}</span>
                </div>
              )}
              {purchaseOrder.supplierPhone && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Phone: {purchaseOrder.supplierPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{purchaseOrder.warehouseName}</p>
                  {purchaseOrder.warehouseAddress && (
                    <p className="text-sm text-muted-foreground">{purchaseOrder.warehouseAddress}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {format(new Date(purchaseOrder.createdAt), "MMM dd, yyyy HH:mm")}</span>
              </div>
              {purchaseOrder.createdByName && (
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Created by: {purchaseOrder.createdByName}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
