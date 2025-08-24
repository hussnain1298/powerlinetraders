import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, Wrench, Clock } from "lucide-react"

export function Hero() {
  return (
    <div className="relative bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Reliable Generator Parts for
            <span className="text-accent"> Industrial Excellence</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your trusted partner for high-quality generator components. We supply businesses with the parts they need to
            maintain peak performance and minimize downtime.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Request Quote</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Shield className="h-6 w-6 text-accent-foreground" />
                </div>
                Quality Guaranteed
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                All parts meet or exceed OEM specifications with comprehensive warranties.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Wrench className="h-6 w-6 text-accent-foreground" />
                </div>
                Expert Support
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Technical expertise to help you find the right parts for your equipment.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Clock className="h-6 w-6 text-accent-foreground" />
                </div>
                Fast Delivery
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Quick turnaround times to minimize your equipment downtime.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
