import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const products = [
  {
    name: "Spark Plug - Standard",
    description: "High-performance spark plugs for reliable ignition in all weather conditions.",
    image: "/spark-plug-generator-part.png",
    price: "$12.50",
    sku: "GEN-PLUG-001",
    category: "Ignition",
  },
  {
    name: "Air Filter - Heavy Duty",
    description: "Industrial-grade air filters designed for extended operation in harsh environments.",
    image: "/placeholder-fusz3.png",
    price: "$25.00",
    sku: "GEN-FILTER-001",
    category: "Filters",
  },
  {
    name: "Oil Filter - Premium",
    description: "Premium oil filters that ensure clean lubrication for optimal engine performance.",
    image: "/oil-filter-generator.png",
    price: "$18.75",
    sku: "GEN-OIL-001",
    category: "Filters",
  },
  {
    name: "Fuel Filter - High Flow",
    description: "High-flow fuel filters that prevent contamination and ensure clean fuel delivery.",
    image: "/fuel-filter-generator-part.png",
    price: "$22.00",
    sku: "GEN-FUEL-001",
    category: "Filters",
  },
  {
    name: "Drive Belt - Heavy Duty",
    description: "Durable drive belts engineered for high-torque applications and extended life.",
    image: "/drive-belt-generator.png",
    price: "$35.50",
    sku: "GEN-BELT-001",
    category: "Belts",
  },
  {
    name: "Cooling Hose - Reinforced",
    description: "Reinforced cooling hoses designed to withstand high temperatures and pressure.",
    image: "/cooling-hose-generator-part.png",
    price: "$28.75",
    sku: "GEN-HOSE-001",
    category: "Hoses",
  },
]

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Card key={product.sku} className="bg-background">
          <CardHeader className="p-0">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="aspect-[3/2] w-full rounded-t-lg object-cover"
            />
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">{product.category}</span>
              <span className="text-xs text-muted-foreground">{product.sku}</span>
            </div>
            <CardTitle className="text-lg font-semibold text-foreground mb-2">{product.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-4">{product.description}</CardDescription>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-accent">{product.price}</span>
              <Button asChild>
                <Link href="/contact">Inquire Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
