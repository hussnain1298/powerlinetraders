import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/auth"
import { z } from "zod"

const PurchaseOrderItemSchema = z.object({
  productId: z.string().uuid(),
  qty: z.number().positive(),
  unitCost: z.number().min(0),
  taxRate: z.number().min(0).max(100),
})

const PurchaseOrderSchema = z.object({
  supplierId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  notes: z.string().optional(),
  items: z.array(PurchaseOrderItemSchema).min(1),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "purchase:read")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: {
          select: { name: true },
        },
        warehouse: {
          select: { name: true },
        },
        createdBy: {
          select: { name: true },
        },
        items: {
          select: {
            qty: true,
            unitCost: true,
            taxRate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formattedPurchaseOrders = purchaseOrders.map((po) => {
      const subTotal = po.items.reduce((sum, item) => sum + Number(item.qty) * Number(item.unitCost), 0)
      const taxTotal = po.items.reduce(
        (sum, item) => sum + (Number(item.qty) * Number(item.unitCost) * Number(item.taxRate)) / 100,
        0,
      )

      return {
        id: po.id,
        poNumber: po.poNumber,
        supplierName: po.supplier.name,
        warehouseName: po.warehouse.name,
        status: po.status,
        createdAt: po.createdAt.toISOString(),
        createdByName: po.createdBy?.name || null,
        itemCount: po.items.length,
        totalValue: subTotal + taxTotal,
      }
    })

    return NextResponse.json(formattedPurchaseOrders)
  } catch (error) {
    console.error("Error fetching purchase orders:", error)
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "purchase:write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = PurchaseOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
    }

    const { supplierId, warehouseId, notes, items } = parsed.data

    // Generate PO number
    const poCount = await prisma.purchaseOrder.count()
    const poNumber = `PO-${String(poCount + 1).padStart(6, "0")}`

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId,
        warehouseId,
        notes: notes || null,
        status: "OPEN",
        createdById: session.user.id,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            unitCost: item.unitCost,
            taxRate: item.taxRate,
          })),
        },
      },
    })

    return NextResponse.json({ id: purchaseOrder.id, poNumber }, { status: 201 })
  } catch (error) {
    console.error("Error creating purchase order:", error)
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 })
  }
}
