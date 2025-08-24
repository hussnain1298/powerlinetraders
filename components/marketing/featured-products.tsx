import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const featuredProducts = [
  {
    name: "Spark Plug - Standard",
    description: "High-performance spark plugs for reliable ignition in all weather conditions.",
    image: "/spark-plug-generator-part.png",
    price: "$12.50",
    sku: "GEN-PLUG-001",
  },
  {
    name: "Air Filter - Heavy Duty",
    description: "Industrial-grade air filters designed for extended operation in harsh environments.",
    image: "/placeholder-fusz3.png",
    price: "$25.00",
    sku: "GEN-FILTER-001",
  },
  {
    name: "Oil Filter - Premium",
    description: "Premium oil filters that ensure clean lubrication for optimal engine performance.",
    image: "/oil-filter-generator.png",
    price: "$18.75",
    sku: "GEN-OIL-001",
  },
]

export function FeaturedProducts() {
  return (
    <div className="py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Featured Products</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Discover our most popular generator parts trusted by professionals worldwide.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card key={product.sku} className="bg-background">
              <CardHeader className="p-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="aspect-[3/2] w-full rounded-t-lg object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-lg font-semibold text-foreground">{product.name}</CardTitle>
                <CardDescription className="mt-2 text-sm text-muted-foreground">{product.description}</CardDescription>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">{product.price}</span>
                  <Button asChild>
                    <Link href="/contact">Inquire Now</Link>
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">SKU: {product.sku}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
