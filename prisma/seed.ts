import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@example.com",
      passwordHash: await hashPassword("admin123"),
      role: "ADMIN",
    },
  })

  // Create warehouses
  const warehouse1 = await prisma.warehouse.upsert({
    where: { code: "WH001" },
    update: {},
    create: {
      code: "WH001",
      name: "Main Warehouse",
      address: "123 Industrial Ave, City, State 12345",
    },
  })

  const warehouse2 = await prisma.warehouse.upsert({
    where: { code: "WH002" },
    update: {},
    create: {
      code: "WH002",
      name: "Secondary Warehouse",
      address: "456 Storage Blvd, City, State 12345",
    },
  })

  // Create sample products
  const sparkPlug = await prisma.product.upsert({
    where: { sku: "GEN-PLUG-001" },
    update: {},
    create: {
      sku: "GEN-PLUG-001",
      name: "Spark Plug - Standard",
      description: "Standard spark plug for generators",
      unit: "PCS",
      minStock: 50,
      taxRate: 8.25,
    },
  })

  const airFilter = await prisma.product.upsert({
    where: { sku: "GEN-FILTER-001" },
    update: {},
    create: {
      sku: "GEN-FILTER-001",
      name: "Air Filter - Heavy Duty",
      description: "Heavy duty air filter for industrial generators",
      unit: "PCS",
      minStock: 25,
      taxRate: 8.25,
    },
  })

  // Create initial stock
  await prisma.warehouseStock.upsert({
    where: {
      productId_warehouseId: {
        productId: sparkPlug.id,
        warehouseId: warehouse1.id,
      },
    },
    update: {},
    create: {
      productId: sparkPlug.id,
      warehouseId: warehouse1.id,
      qty: 100,
      avgCost: 12.5,
    },
  })

  await prisma.warehouseStock.upsert({
    where: {
      productId_warehouseId: {
        productId: airFilter.id,
        warehouseId: warehouse1.id,
      },
    },
    update: {},
    create: {
      productId: airFilter.id,
      warehouseId: warehouse1.id,
      qty: 50,
      avgCost: 25.0,
    },
  })

  // Create sample supplier
  const supplier = await prisma.supplier
    .upsert({
      where: { id: "temp-id" }, // This will fail and create new
      update: {},
      create: {
        name: "Generator Parts Supply Co.",
        email: "orders@genparts.com",
        phone: "555-0123",
        address: "789 Supplier St, Industrial City, State 54321",
      },
    })
    .catch(async () => {
      // If upsert fails, just create
      return prisma.supplier.create({
        data: {
          name: "Generator Parts Supply Co.",
          email: "orders@genparts.com",
          phone: "555-0123",
          address: "789 Supplier St, Industrial City, State 54321",
        },
      })
    })

  // Create sample customer
  const customer = await prisma.customer
    .create({
      data: {
        name: "ABC Construction",
        email: "purchasing@abcconstruction.com",
        phone: "555-0456",
        address: "321 Builder Ave, Construction City, State 98765",
      },
    })
    .catch(() => null) // Ignore if already exists

  console.log("✅ Seed completed successfully!")
  console.log(`👤 Admin user: admin@example.com / admin123`)
  console.log(`🏢 Warehouses: ${warehouse1.name}, ${warehouse2.name}`)
  console.log(`📦 Products: ${sparkPlug.name}, ${airFilter.name}`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
