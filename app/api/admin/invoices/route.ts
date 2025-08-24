import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invoiceCount = await prisma.salesInvoice.count()

    if (invoiceCount === 0) {
      // Return sample data for demonstration
      const sampleInvoices = [
        {
          id: "sample-1",
          invoiceNumber: "INV-0001",
          customer: { id: "1", name: "ABC Manufacturing Co.", code: "ABC001" },
          warehouse: { id: "1", name: "Main Warehouse", code: "MW001" },
          invoiceDate: new Date("2024-01-15"),
          dueDate: new Date("2024-02-15"),
          subtotalAmount: 850.0,
          taxAmount: 68.0,
          totalAmount: 918.0,
          paidAmount: 918.0,
          status: "PAID",
          createdAt: new Date("2024-01-15"),
        },
        {
          id: "sample-2",
          invoiceNumber: "INV-0002",
          customer: { id: "2", name: "Power Solutions Ltd.", code: "PSL002" },
          warehouse: { id: "1", name: "Main Warehouse", code: "MW001" },
          invoiceDate: new Date("2024-01-20"),
          dueDate: new Date("2024-02-20"),
          subtotalAmount: 1250.0,
          taxAmount: 100.0,
          totalAmount: 1350.0,
          paidAmount: 675.0,
          status: "PENDING",
          createdAt: new Date("2024-01-20"),
        },
        {
          id: "sample-3",
          invoiceNumber: "INV-0003",
          customer: { id: "3", name: "Industrial Motors Inc.", code: "IMI003" },
          warehouse: { id: "1", name: "Main Warehouse", code: "MW001" },
          invoiceDate: new Date("2024-01-10"),
          dueDate: new Date("2024-01-25"),
          subtotalAmount: 2100.0,
          taxAmount: 168.0,
          totalAmount: 2268.0,
          paidAmount: 0.0,
          status: "OVERDUE",
          createdAt: new Date("2024-01-10"),
        },
      ]

      return NextResponse.json(sampleInvoices)
    }

    const invoices = await prisma.salesInvoice.findMany({
      include: {
        customer: {
          select: { id: true, name: true, code: true },
        },
        warehouse: {
          select: { id: true, name: true, code: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      customerId,
      warehouseId,
      invoiceDate,
      dueDate,
      notes,
      taxRate,
      lineItems,
      subtotalAmount,
      taxAmount,
      totalAmount,
    } = data

    // Validate line items have sufficient stock
    for (const item of lineItems) {
      const stock = await prisma.stock.findFirst({
        where: {
          productId: item.productId,
          warehouseId: warehouseId,
        },
      })

      if (!stock || stock.quantity < item.quantity) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        })
        return NextResponse.json({ error: `Insufficient stock for ${product?.name}` }, { status: 400 })
      }
    }

    // Generate invoice number
    const lastInvoice = await prisma.salesInvoice.findFirst({
      orderBy: { createdAt: "desc" },
      select: { invoiceNumber: true },
    })

    let invoiceNumber = "INV-0001"
    if (lastInvoice?.invoiceNumber) {
      const lastNumber = Number.parseInt(lastInvoice.invoiceNumber.split("-")[1])
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(4, "0")}`
    }

    // Create invoice with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create invoice
      const invoice = await tx.salesInvoice.create({
        data: {
          invoiceNumber,
          customerId,
          warehouseId,
          invoiceDate: new Date(invoiceDate),
          dueDate: dueDate ? new Date(dueDate) : null,
          notes: notes || null,
          taxRate,
          subtotalAmount,
          taxAmount,
          totalAmount,
          paidAmount: 0,
          status: "PENDING",
          createdById: session.user.id,
        },
      })

      // Create line items and update stock
      for (const item of lineItems) {
        await tx.salesInvoiceItem.create({
          data: {
            salesInvoiceId: invoice.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.total,
          },
        })

        // Update stock
        await tx.stock.updateMany({
          where: {
            productId: item.productId,
            warehouseId: warehouseId,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        })

        // Create stock movement
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            warehouseId: warehouseId,
            type: "OUT",
            quantity: item.quantity,
            reason: `Sales Invoice ${invoiceNumber}`,
            referenceId: invoice.id,
            referenceType: "SALES_INVOICE",
            createdById: session.user.id,
          },
        })
      }

      return invoice
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
