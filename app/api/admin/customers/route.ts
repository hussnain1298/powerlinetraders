import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
    })
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customerCount = await prisma.customer.count()

    if (customerCount === 0) {
      const sampleCustomers = [
        {
          id: "sample-1",
          code: "ABC001",
          name: "ABC Manufacturing Co.",
          email: "orders@abcmanufacturing.com",
          phone: "+1 (555) 123-4567",
          address: "1234 Industrial Blvd, Manufacturing City, MC 12345",
          taxId: "TAX123456789",
          isActive: true,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
        {
          id: "sample-2",
          code: "PSL002",
          name: "Power Solutions Ltd.",
          email: "procurement@powersolutions.com",
          phone: "+1 (555) 987-6543",
          address: "5678 Energy Ave, Power City, PC 54321",
          taxId: "TAX987654321",
          isActive: true,
          createdAt: new Date("2024-01-05"),
          updatedAt: new Date("2024-01-05"),
        },
        {
          id: "sample-3",
          code: "IMI003",
          name: "Industrial Motors Inc.",
          email: "parts@industrialmotors.com",
          phone: "+1 (555) 456-7890",
          address: "9012 Motor Way, Engine Town, ET 67890",
          taxId: "TAX456789012",
          isActive: true,
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-10"),
        },
        {
          id: "sample-4",
          code: "GEN004",
          name: "Generator Services Corp.",
          email: "service@generatorservices.com",
          phone: "+1 (555) 321-0987",
          address: "3456 Service St, Repair City, RC 09876",
          taxId: "TAX321098765",
          isActive: false,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
        },
      ]

      return NextResponse.json(sampleCustomers)
    }

    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { code, name, email, phone, address, taxId, isActive } = data

    // Check if customer code already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { code },
    })

    if (existingCustomer) {
      return NextResponse.json({ error: "Customer code already exists" }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        code,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        taxId: taxId || null,
        isActive,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { code, name, email, phone, address, taxId, isActive } = data

    // Check if customer code already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { code },
    })

    if (existingCustomer) {
      return NextResponse.json({ error: "Customer code already exists" }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        code,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        taxId: taxId || null,
        isActive,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
