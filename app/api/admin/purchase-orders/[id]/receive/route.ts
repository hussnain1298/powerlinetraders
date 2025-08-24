import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/auth"
import { z } from "zod"

const ReceiveItemSchema = z.object({
  itemId: z.string().uuid(),
  receivedQty: z.number().min(0),
})

const ReceiveSchema = z.object({
  items: z.array(ReceiveItemSchema),
})

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "purchase:write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = ReceiveSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
    }

    const { items } = parsed.data

    // Execute receiving in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get purchase order with items
      const purchaseOrder = await tx.purchaseOrder.findUnique({
        where: { id: params.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!purchaseOrder) {
        throw new Error("Purchase order not found")
      }

      if (purchaseOrder.status !== "OPEN") {
        throw new Error("Purchase order is not open for receiving")
      }

      // Process each received item
      for (const receiveItem of items) {
        if (receiveItem.receivedQty <= 0) continue

        const poItem = purchaseOrder.items.find((item) => item.id === receiveItem.itemId)
        if (!poItem) {
          throw new Error(`Purchase order item not found: ${receiveItem.itemId}`)
        }

        // Update or create warehouse stock
        await tx.warehouseStock.upsert({
          where: {
            productId_warehouseId: {
              productId: poItem.productId,
              warehouseId: purchaseOrder.warehouseId,
            },
          },
          update: {
            qty: {
              increment: receiveItem.receivedQty,
            },
            avgCost: poItem.unitCost, // Simplified - should calculate weighted average
          },
          create: {
            productId: poItem.productId,
            warehouseId: purchaseOrder.warehouseId,
            qty: receiveItem.receivedQty,
            avgCost: poItem.unitCost,
          },
        })

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            movementType: "PURCHASE",
            productId: poItem.productId,
            toWarehouseId: purchaseOrder.warehouseId,
            qty: receiveItem.receivedQty,
            unitCost: poItem.unitCost,
            reference: purchaseOrder.poNumber,
            createdById: session.user.id,
          },
        })
      }

      // Update purchase order status to RECEIVED
      await tx.purchaseOrder.update({
        where: { id: params.id },
        data: { status: "RECEIVED" },
      })

      return { success: true }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error receiving purchase order:", error)
    const message = error instanceof Error ? error.message : "Failed to receive purchase order"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
