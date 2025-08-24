import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/auth"
import { z } from "zod"

const ProductSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  unit: z.enum(["PCS", "SET", "BOX", "LITER", "KG", "HOUR"]),
  minStock: z.number().min(0, "Minimum stock must be non-negative"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  location: z.string().optional(), // Added location field to schema validation
  isActive: z.boolean(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "product:read")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !can(session.user, "product:write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = ProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 })
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: parsed.data.sku },
    })

    if (existingProduct) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: parsed.data,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
