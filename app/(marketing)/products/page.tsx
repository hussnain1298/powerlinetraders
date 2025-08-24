import { ProductGrid } from "@/components/marketing/product-grid"

export default function ProductsPage() {
  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of high-quality generator parts designed to keep your equipment running at
            peak performance.
          </p>
        </div>

        <ProductGrid />
      </div>
    </div>
  )
}
