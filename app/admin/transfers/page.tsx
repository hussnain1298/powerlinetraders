"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"
import { format } from "date-fns"

interface StockMovement {
  id: string
  movementType: string
  productName: string
  productSku: string
  fromWarehouseName: string | null
  toWarehouseName: string | null
  qty: number
  unitCost: number
  reference: string | null
  createdAt: string
  createdByName: string | null
}

export default function TransfersPage() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovements()
  }, [])

  const fetchMovements = async () => {
    try {
      const response = await fetch("/api/admin/stock-movements")
      if (response.ok) {
        const data = await response.json()
        setMovements(data)
      }
    } catch (error) {
      console.error("Failed to fetch movements:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case "TRANSFER":
        return "default"
      case "ADJUSTMENT":
        return "secondary"
      case "PURCHASE":
        return "outline"
      case "SALE":
        return "destructive"
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
          <h1 className="text-2xl font-bold text-foreground">Stock Transfers</h1>
          <p className="text-muted-foreground">Manage inventory movements between warehouses</p>
        </div>
        <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
          <Button asChild>
            <Link href="/admin/transfers/new">
              <Plus className="mr-2 h-4 w-4" />
              New Transfer
            </Link>
          </Button>
        </RoleGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
          <CardDescription>History of all inventory movements and transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No stock movements found</p>
              </div>
            ) : (
              movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant={getMovementTypeColor(movement.movementType)}>{movement.movementType}</Badge>
                      <h3 className="font-semibold text-foreground">{movement.productName}</h3>
                      <span className="text-sm text-muted-foreground">({movement.productSku})</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {movement.movementType === "TRANSFER" && (
                        <div className="flex items-center space-x-2">
                          <span>{movement.fromWarehouseName}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{movement.toWarehouseName}</span>
                        </div>
                      )}
                      {movement.movementType !== "TRANSFER" && (
                        <span>
                          {movement.movementType === "PURCHASE" && `To: ${movement.toWarehouseName}`}
                          {movement.movementType === "SALE" && `From: ${movement.fromWarehouseName}`}
                          {movement.movementType === "ADJUSTMENT" &&
                            `Warehouse: ${movement.toWarehouseName || movement.fromWarehouseName}`}
                        </span>
                      )}
                      <span>Qty: {movement.qty}</span>
                      <span>Cost: ${movement.unitCost.toFixed(2)}</span>
                      {movement.reference && <span>Ref: {movement.reference}</span>}
                    </div>

                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(movement.createdAt), "MMM dd, yyyy HH:mm")}</span>
                      </div>
                      {movement.createdByName && <span>By: {movement.createdByName}</span>}
                    </div>
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
