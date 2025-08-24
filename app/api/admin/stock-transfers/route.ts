import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/auth"
import { z } from "zod"

const TransferSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  fromWarehouseId: z.string().uuid("Invalid from warehouse ID"),
  toWarehouseId: z.string().uuid("Invalid to warehouse ID"),
  qty: z.number().positive("Quantity must be positive"),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "stock:transfer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = TransferSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
    }

    const { productId, fromWarehouseId, toWarehouseId, qty, reference, notes } = parsed.data

    // Validate warehouses are different
    if (fromWarehouseId === toWarehouseId) {
      return NextResponse.json({ error: "Source and destination warehouses must be different" }, { status: 400 })
    }

    // Execute transfer in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check source stock
      const sourceStock = await tx.warehouseStock.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: fromWarehouseId,
          },
        },
      })

      if (!sourceStock || Number(sourceStock.qty) < qty) {
        throw new Error("Insufficient stock in source warehouse")
      }

      // Update source warehouse stock
      await tx.warehouseStock.update({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: fromWarehouseId,
          },
        },
        data: {
          qty: {
            decrement: qty,
          },
        },
      })

      // Update or create destination warehouse stock
      await tx.warehouseStock.upsert({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId: toWarehouseId,
          },
        },
        update: {
          qty: {
            increment: qty,
          },
          avgCost: sourceStock.avgCost, // Use source cost for now
        },
        create: {
          productId,
          warehouseId: toWarehouseId,
          qty,
          avgCost: sourceStock.avgCost,
        },
      })

      // Create stock movement record
      const movement = await tx.stockMovement.create({
        data: {
          movementType: "TRANSFER",
          productId,
          fromWarehouseId,
          toWarehouseId,
          qty,
          unitCost: sourceStock.avgCost,
          reference: reference || `TRANSFER-${Date.now()}`,
          createdById: session.user.id,
        },
      })

      return movement
    })

    return NextResponse.json({ success: true, movementId: result.id }, { status: 201 })
  } catch (error) {
    console.error("Error creating stock transfer:", error)
    const message = error instanceof Error ? error.message : "Failed to create stock transfer"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
