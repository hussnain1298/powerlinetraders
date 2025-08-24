import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const InquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
})

export async function POST(request: Request) {
  try {
    console.log("[v0] Inquiry API called")
    const body = await request.json()
    console.log("[v0] Request body:", body)

    const parsed = InquirySchema.safeParse(body)
    console.log("[v0] Schema validation result:", parsed.success)

    if (!parsed.success) {
      console.log("[v0] Validation errors:", parsed.error.flatten())
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 })
    }

    console.log("[v0] Attempting to create inquiry in database")
    const inquiry = await prisma.inquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
        status: "NEW",
      },
    })
    console.log("[v0] Inquiry created successfully:", inquiry.id)

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to customer

    return NextResponse.json({
      success: true,
      id: inquiry.id,
    })
  } catch (error) {
    console.error("[v0] Error creating inquiry:", error)
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
