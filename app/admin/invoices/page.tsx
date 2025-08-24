import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Eye, Download } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"

async function getInvoices() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/invoices`, {
    cache: "no-store",
  })
  if (!response.ok) throw new Error("Failed to fetch invoices")
  return response.json()
}

function getStatusColor(status: string) {
  switch (status) {
    case "PAID":
      return "default"
    case "PENDING":
      return "secondary"
    case "OVERDUE":
      return "destructive"
    case "CANCELLED":
      return "outline"
    default:
      return "secondary"
  }
}

async function InvoicesList() {
  const invoices = await getInvoices()

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground text-center mb-4">Get started by creating your first sales invoice.</p>
            <Button asChild>
              <Link href="/admin/invoices/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice: any) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                      <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
                      {invoice.dueDate && ` • Due: ${new Date(invoice.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-semibold">${invoice.totalAmount.toFixed(2)}</p>
                    {invoice.paidAmount > 0 && (
                      <p className="text-sm text-muted-foreground">Paid: ${invoice.paidAmount.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/invoices/${invoice.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER", "STAFF"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Invoices</h1>
            <p className="text-muted-foreground">Manage your sales invoices and track payments.</p>
          </div>
          <Button asChild>
            <Link href="/admin/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input placeholder="Search invoices..." className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading invoices...</div>}>
              <InvoicesList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
