"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, Package, TrendingDown, ArrowRightLeft } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"

interface InventoryItem {
  productId: string
  productName: string
  productSku: string
  warehouseId: string
  warehouseName: string
  warehouseCode: string
  qty: number
  avgCost: number
  minStock: number
  totalValue: number
  isLowStock: boolean
}

interface Warehouse {
  id: string
  name: string
  code: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all")
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [inventoryResponse, warehousesResponse] = await Promise.all([
        fetch("/api/admin/inventory"),
        fetch("/api/admin/warehouses"),
      ])

      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json()
        setInventory(inventoryData)
      }

      if (warehousesResponse.ok) {
        const warehousesData = await warehousesResponse.json()
        setWarehouses(warehousesData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productSku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWarehouse = selectedWarehouse === "all" || item.warehouseId === selectedWarehouse
    const matchesLowStock = !showLowStockOnly || item.isLowStock
    return matchesSearch && matchesWarehouse && matchesLowStock
  })

  const totalValue = filteredInventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockCount = inventory.filter((item) => item.isLowStock).length

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
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor stock levels across all warehouses</p>
        </div>
        <div className="flex items-center space-x-2">
          <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
            <Button asChild>
              <Link href="/admin/transfers/new">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transfer Stock
              </Link>
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across all warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items below minimum stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(inventory.map((item) => item.productId)).size}</div>
            <p className="text-xs text-muted-foreground">Unique products tracked</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Stock Levels</CardTitle>
          <CardDescription>View and manage inventory across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showLowStockOnly ? "default" : "outline"}
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Low Stock Only
            </Button>
          </div>

          {/* Inventory Table */}
          <div className="space-y-4">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No inventory items found</p>
              </div>
            ) : (
              filteredInventory.map((item) => (
                <div
                  key={`${item.productId}-${item.warehouseId}`}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">SKU: {item.productSku}</p>
                      </div>
                      {item.isLowStock && (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Low Stock</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                      <span>Warehouse: {item.warehouseName}</span>
                      <span>Current: {item.qty}</span>
                      <span>Min: {item.minStock}</span>
                      <span>Avg Cost: ${item.avgCost.toFixed(2)}</span>
                      <span>Value: ${item.totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                  <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin/transfers/new?productId=${item.productId}&fromWarehouse=${item.warehouseId}`}
                        >
                          Transfer
                        </Link>
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
