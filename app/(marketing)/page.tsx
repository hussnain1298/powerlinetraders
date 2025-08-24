import { Hero } from "@/components/marketing/hero"
import { FeaturedProducts } from "@/components/marketing/featured-products"
import { Services } from "@/components/marketing/services"
import { ContactCTA } from "@/components/marketing/contact-cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Services />
      <ContactCTA />
    </>
  )
}
