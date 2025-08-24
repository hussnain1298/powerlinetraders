import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "stock:read")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inventory = await prisma.warehouseStock.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            minStock: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [{ product: { name: "asc" } }, { warehouse: { name: "asc" } }],
    })

    const inventoryWithCalculations = inventory.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productSku: item.product.sku,
      warehouseId: item.warehouse.id,
      warehouseName: item.warehouse.name,
      warehouseCode: item.warehouse.code,
      qty: Number(item.qty),
      avgCost: Number(item.avgCost),
      minStock: Number(item.product.minStock),
      totalValue: Number(item.qty) * Number(item.avgCost),
      isLowStock: Number(item.qty) <= Number(item.product.minStock),
    }))

    return NextResponse.json(inventoryWithCalculations)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}
