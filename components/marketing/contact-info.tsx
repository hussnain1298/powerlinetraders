import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Address</p>
              <p className="text-muted-foreground">
                123 Industrial Avenue
                <br />
                Manufacturing District
                <br />
                City, State 12345
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Phone</p>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Email</p>
              <p className="text-muted-foreground">info@powerpartspro.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Business Hours</p>
              <p className="text-muted-foreground">
                Monday - Friday: 8:00 AM - 6:00 PM
                <br />
                Saturday: 9:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Choose Us?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Over 20 years of industry experience</li>
            <li>• Extensive inventory of OEM and aftermarket parts</li>
            <li>• Same-day shipping on most orders</li>
            <li>• Technical support from certified professionals</li>
            <li>• Competitive pricing with volume discounts</li>
            <li>• Comprehensive warranty on all products</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
