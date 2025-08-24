import { Header } from "@/components/marketing/header"
import { Footer } from "@/components/marketing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About PowerParts Pro</h1>
              <p className="text-xl text-slate-600 mb-8">
                Your trusted partner for generator parts and services since 1995. We've been keeping businesses powered
                through reliable parts supply and expert maintenance services.
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Founded in 1995 by electrical engineer Robert Johnson, PowerParts Pro began as a small parts supplier
                  serving local businesses. What started in a 2,000 sq ft warehouse has grown into a comprehensive
                  generator services company with over 50,000 parts in inventory.
                </p>
                <p className="text-lg text-slate-600 mb-6">
                  Today, we serve industrial and commercial clients across the region, providing everything from
                  emergency repairs to scheduled maintenance programs. Our commitment to quality parts, expert service,
                  and customer satisfaction has made us the go-to choice for generator solutions.
                </p>
                <Button asChild>
                  <Link href="/contact">Work With Us</Link>
                </Button>
              </div>
              <div className="relative">
                <Image
                  src="/industrial-warehouse-with-generator-parts-and-equi.png"
                  alt="PowerParts Pro warehouse facility"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <Card>
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-900 mb-2">2,500+</div>
                  <div className="text-slate-600">Happy Customers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-900 mb-2">50,000+</div>
                  <div className="text-slate-600">Parts in Stock</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-900 mb-2">29</div>
                  <div className="text-slate-600">Years Experience</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-900 mb-2">24/7</div>
                  <div className="text-slate-600">Emergency Service</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Leadership Team</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Meet the experienced professionals who lead our commitment to excellence in generator parts and
                services.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Image
                    src="/middle-aged-businessman-headshot.png"
                    alt="Robert Johnson, CEO"
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Robert Johnson</h3>
                  <p className="text-orange-600 font-medium mb-3">CEO & Founder</p>
                  <p className="text-slate-600">
                    Electrical engineer with 35+ years in power systems. Founded PowerParts Pro with a vision to provide
                    reliable generator solutions.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Image
                    src="/professional-headshot-of-woman-in-business-attire.png"
                    alt="Sarah Martinez, Operations Director"
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Sarah Martinez</h3>
                  <p className="text-orange-600 font-medium mb-3">Operations Director</p>
                  <p className="text-slate-600">
                    Supply chain expert who ensures our inventory meets customer needs. 15 years optimizing parts
                    availability and logistics.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Image
                    src="/professional-headshot-of-man-in-work-uniform.png"
                    alt="Mike Thompson, Service Manager"
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Mike Thompson</h3>
                  <p className="text-orange-600 font-medium mb-3">Service Manager</p>
                  <p className="text-slate-600">
                    Master technician leading our service team. Certified in all major generator brands with 20+ years
                    field experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                The principles that guide everything we do and every relationship we build.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-slate-300">
                  We source only the highest quality parts and provide services that meet the strictest industry
                  standards.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Reliability</h3>
                <p className="text-slate-300">
                  When you need us, we're there. Our commitment to reliability extends to every aspect of our business.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
                <p className="text-slate-300">
                  Your success is our success. We build lasting partnerships by understanding and exceeding your
                  expectations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
