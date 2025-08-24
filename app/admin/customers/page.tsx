import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Building2, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"

async function getCustomers() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/customers`, {
    cache: "no-store",
  })
  if (!response.ok) throw new Error("Failed to fetch customers")
  return response.json()
}

async function CustomersList() {
  const customers = await getCustomers()

  return (
    <div className="space-y-4">
      {customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground text-center mb-4">Get started by adding your first customer.</p>
            <Button asChild>
              <Link href="/admin/customers/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer: any) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <CardDescription>{customer.code}</CardDescription>
                  </div>
                  <Badge variant={customer.isActive ? "default" : "secondary"}>
                    {customer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {customer.email && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {customer.email}
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {customer.phone}
                  </div>
                )}
                {customer.address && <p className="text-sm text-muted-foreground line-clamp-2">{customer.address}</p>}
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href={`/admin/customers/${customer.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CustomersPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">Manage your customer database and contact information.</p>
          </div>
          <Button asChild>
            <Link href="/admin/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input placeholder="Search customers..." className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading customers...</div>}>
              <CustomersList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
