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

    const movements = await prisma.stockMovement.findMany({
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
        fromWarehouse: {
          select: {
            name: true,
          },
        },
        toWarehouse: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to recent movements
    })

    const formattedMovements = movements.map((movement) => ({
      id: movement.id,
      movementType: movement.movementType,
      productName: movement.product.name,
      productSku: movement.product.sku,
      fromWarehouseName: movement.fromWarehouse?.name || null,
      toWarehouseName: movement.toWarehouse?.name || null,
      qty: Number(movement.qty),
      unitCost: Number(movement.unitCost),
      reference: movement.reference,
      createdAt: movement.createdAt.toISOString(),
      createdByName: movement.createdBy?.name || null,
    }))

    return NextResponse.json(formattedMovements)
  } catch (error) {
    console.error("Error fetching stock movements:", error)
    return NextResponse.json({ error: "Failed to fetch stock movements" }, { status: 500 })
  }
}
