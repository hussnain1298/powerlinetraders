"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  sku: string
}

interface Warehouse {
  id: string
  name: string
  code: string
}

interface InventoryItem {
  productId: string
  warehouseId: string
  qty: number
}

export default function NewTransferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [formData, setFormData] = useState({
    productId: searchParams.get("productId") || "",
    fromWarehouseId: searchParams.get("fromWarehouse") || "",
    toWarehouseId: "",
    qty: "",
    reference: "",
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsResponse, warehousesResponse, inventoryResponse] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/warehouses"),
        fetch("/api/admin/inventory"),
      ])

      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData)
      }

      if (warehousesResponse.ok) {
        const warehousesData = await warehousesResponse.json()
        setWarehouses(warehousesData.filter((w: Warehouse) => w.isActive))
      }

      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json()
        setInventory(inventoryData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/stock-transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          qty: Number.parseFloat(formData.qty),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create transfer")
      }

      router.push("/admin/transfers")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create transfer")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getAvailableStock = () => {
    if (!formData.productId || !formData.fromWarehouseId) return 0
    const item = inventory.find(
      (inv) => inv.productId === formData.productId && inv.warehouseId === formData.fromWarehouseId,
    )
    return item?.qty || 0
  }

  const selectedProduct = products.find((p) => p.id === formData.productId)
  const fromWarehouse = warehouses.find((w) => w.id === formData.fromWarehouseId)
  const toWarehouse = warehouses.find((w) => w.id === formData.toWarehouseId)
  const availableStock = getAvailableStock()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/transfers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transfers
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Stock Transfer</h1>
          <p className="text-muted-foreground">Move inventory between warehouses</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>Select the product and warehouses for the stock transfer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="productId">Product *</Label>
              <Select value={formData.productId} onValueChange={(value) => handleChange("productId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fromWarehouseId">From Warehouse *</Label>
                <Select
                  value={formData.fromWarehouseId}
                  onValueChange={(value) => handleChange("fromWarehouseId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses
                      .filter((w) => w.id !== formData.toWarehouseId)
                      .map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} ({warehouse.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {formData.fromWarehouseId && (
                  <p className="text-xs text-muted-foreground">Available stock: {availableStock}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toWarehouseId">To Warehouse *</Label>
                <Select value={formData.toWarehouseId} onValueChange={(value) => handleChange("toWarehouseId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses
                      .filter((w) => w.id !== formData.fromWarehouseId)
                      .map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} ({warehouse.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transfer Summary */}
            {selectedProduct && fromWarehouse && toWarehouse && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-muted-foreground">{selectedProduct.sku}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-center">
                      <p className="font-medium">{fromWarehouse.name}</p>
                      <p className="text-muted-foreground">Available: {availableStock}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium">{toWarehouse.name}</p>
                      <p className="text-muted-foreground">Destination</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity *</Label>
                <Input
                  id="qty"
                  type="number"
                  min="0.001"
                  max={availableStock}
                  step="0.001"
                  value={formData.qty}
                  onChange={(e) => handleChange("qty", e.target.value)}
                  placeholder="Enter quantity to transfer"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange("reference", e.target.value)}
                  placeholder="Transfer reference (optional)"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional notes about this transfer..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button
                type="submit"
                disabled={
                  loading ||
                  !formData.productId ||
                  !formData.fromWarehouseId ||
                  !formData.toWarehouseId ||
                  !formData.qty
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Transfer...
                  </>
                ) : (
                  "Execute Transfer"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/transfers">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
