import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "purchase:read")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: {
        supplier: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        warehouse: {
          select: {
            name: true,
            address: true,
          },
        },
        createdBy: {
          select: { name: true },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    })

    if (!purchaseOrder) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    const formattedItems = purchaseOrder.items.map((item) => {
      const lineSubtotal = Number(item.qty) * Number(item.unitCost)
      const lineTax = (lineSubtotal * Number(item.taxRate)) / 100
      return {
        id: item.id,
        productName: item.product.name,
        productSku: item.product.sku,
        orderedQty: Number(item.qty),
        unitCost: Number(item.unitCost),
        taxRate: Number(item.taxRate),
        lineTotal: lineSubtotal + lineTax,
        receivedQty: 0, // TODO: Track received quantities
      }
    })

    const subTotal = formattedItems.reduce((sum, item) => sum + Number(item.orderedQty) * item.unitCost, 0)
    const taxTotal = formattedItems.reduce(
      (sum, item) => sum + item.lineTotal - Number(item.orderedQty) * item.unitCost,
      0,
    )

    const formattedPurchaseOrder = {
      id: purchaseOrder.id,
      poNumber: purchaseOrder.poNumber,
      supplierName: purchaseOrder.supplier.name,
      supplierEmail: purchaseOrder.supplier.email,
      supplierPhone: purchaseOrder.supplier.phone,
      warehouseName: purchaseOrder.warehouse.name,
      warehouseAddress: purchaseOrder.warehouse.address,
      status: purchaseOrder.status,
      notes: purchaseOrder.notes,
      createdAt: purchaseOrder.createdAt.toISOString(),
      createdByName: purchaseOrder.createdBy?.name || null,
      items: formattedItems,
      subTotal,
      taxTotal,
      grandTotal: subTotal + taxTotal,
    }

    return NextResponse.json(formattedPurchaseOrder)
  } catch (error) {
    console.error("Error fetching purchase order:", error)
    return NextResponse.json({ error: "Failed to fetch purchase order" }, { status: 500 })
  }
}
