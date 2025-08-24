import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Headphones, Award, Users } from "lucide-react"

const services = [
  {
    name: "Fast Shipping",
    description: "Same-day processing and expedited shipping options to minimize your downtime.",
    icon: Truck,
  },
  {
    name: "Technical Support",
    description: "Expert guidance from certified technicians to help you find the right parts.",
    icon: Headphones,
  },
  {
    name: "Quality Assurance",
    description: "All parts tested and certified to meet or exceed OEM specifications.",
    icon: Award,
  },
  {
    name: "B2B Solutions",
    description: "Dedicated account management and volume pricing for business customers.",
    icon: Users,
  },
]

export function Services() {
  return (
    <div className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose Powerline Traders</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            We're committed to providing exceptional service and support for all your generator parts needs.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <Card key={service.name} className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <service.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
