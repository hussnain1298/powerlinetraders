import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ContactCTA() {
  return (
    <div className="bg-accent">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-accent-foreground sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-accent-foreground/90">
            Contact our team today for personalized assistance with your generator parts needs. We're here to help keep
            your equipment running smoothly.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Us Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10 bg-transparent"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
