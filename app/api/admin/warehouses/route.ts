import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/auth"
import { z } from "zod"

const WarehouseSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  isActive: z.boolean(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "warehouse:read")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(warehouses)
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "warehouse:write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = WarehouseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
    }

    // Check if code already exists
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { code: parsed.data.code },
    })

    if (existingWarehouse) {
      return NextResponse.json({ error: "Warehouse code already exists" }, { status: 400 })
    }

    const warehouse = await prisma.warehouse.create({
      data: parsed.data,
    })

    return NextResponse.json(warehouse, { status: 201 })
  } catch (error) {
    console.error("Error creating warehouse:", error)
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 })
  }
}
