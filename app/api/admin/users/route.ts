import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userCount = await prisma.user.count()

    if (userCount === 0) {
      const sampleUsers = [
        {
          id: "sample-1",
          name: "System Administrator",
          email: "admin@company.com",
          role: "ADMIN",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
        {
          id: "sample-2",
          name: "John Manager",
          email: "john.manager@company.com",
          role: "MANAGER",
          createdAt: new Date("2024-01-05"),
          updatedAt: new Date("2024-01-05"),
        },
        {
          id: "sample-3",
          name: "Sarah Staff",
          email: "sarah.staff@company.com",
          role: "STAFF",
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-10"),
        },
        {
          id: "sample-4",
          name: "Mike Warehouse",
          email: "mike.warehouse@company.com",
          role: "STAFF",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
        },
      ]

      return NextResponse.json(sampleUsers)
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
