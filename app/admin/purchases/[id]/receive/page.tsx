"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Package } from "lucide-react"
import Link from "next/link"

interface PurchaseOrderItem {
  id: string
  productName: string
  productSku: string
  orderedQty: number
  unitCost: number
  receivedQty: number
}

interface PurchaseOrderReceive {
  id: string
  poNumber: string
  supplierName: string
  warehouseName: string
  items: PurchaseOrderItem[]
}

export default function ReceivePurchaseOrderPage() {
  const params = useParams()
  const router = useRouter()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderReceive | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [receivingData, setReceivingData] = useState<Record<string, number>>({})

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
        // Initialize receiving data with ordered quantities
        const initialReceiving: Record<string, number> = {}
        data.items.forEach((item: PurchaseOrderItem) => {
          initialReceiving[item.id] = item.orderedQty - item.receivedQty
        })
        setReceivingData(initialReceiving)
      }
    } catch (error) {
      console.error("Failed to fetch purchase order:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReceivingChange = (itemId: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setReceivingData((prev) => ({
      ...prev,
      [itemId]: numValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/purchase-orders/${params.id}/receive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: Object.entries(receivingData).map(([itemId, qty]) => ({
            itemId,
            receivedQty: qty,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to receive items")
      }

      router.push(`/admin/purchases/${params.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to receive items")
    } finally {
      setSubmitting(false)
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
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/purchases/${purchaseOrder.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchase Order
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receive Items - {purchaseOrder.poNumber}</h1>
          <p className="text-muted-foreground">Update inventory by receiving purchased items</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receiving Information</CardTitle>
          <CardDescription>
            Supplier: {purchaseOrder.supplierName} | Warehouse: {purchaseOrder.warehouseName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <div className="col-span-2">Product</div>
                <div>Ordered</div>
                <div>Received</div>
                <div>Receiving Now</div>
              </div>

              {purchaseOrder.items.map((item) => (
                <div key={item.id} className="grid grid-cols-5 gap-4 items-center py-2">
                  <div className="col-span-2">
                    <p className="font-semibold text-foreground">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.productSku}</p>
                  </div>
                  <div className="text-sm">{item.orderedQty}</div>
                  <div className="text-sm">{item.receivedQty}</div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max={item.orderedQty - item.receivedQty}
                      step="0.001"
                      value={receivingData[item.id] || 0}
                      onChange={(e) => handleReceivingChange(item.id, e.target.value)}
                      disabled={submitting}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t">
              <Button type="submit" disabled={submitting} className="min-w-32">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Receiving...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Receive Items
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/admin/purchases/${purchaseOrder.id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
