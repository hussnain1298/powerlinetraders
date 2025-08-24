import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, CreditCard } from "lucide-react"
import Link from "next/link"
import { RoleGuard } from "@/components/auth/role-guard"
import { prisma } from "@/lib/prisma"

async function getInvoice(id: string) {
  const invoice = await prisma.salesInvoice.findUnique({
    where: { id },
    include: {
      customer: true,
      warehouse: true,
      items: {
        include: {
          product: true,
        },
      },
      createdBy: {
        select: { name: true, email: true },
      },
    },
  })

  if (!invoice) {
    notFound()
  }

  return invoice
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

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id)

  return (
    <RoleGuard allowedRoles={["ADMIN", "MANAGER", "STAFF"]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/invoices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">Sales Invoice Details</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {invoice.status === "PENDING" && (
              <Button size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-semibold">{invoice.customer.name}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer.code}</p>
              </div>
              {invoice.customer.email && <p className="text-sm">{invoice.customer.email}</p>}
              {invoice.customer.phone && <p className="text-sm">{invoice.customer.phone}</p>}
              {invoice.customer.address && <p className="text-sm text-muted-foreground">{invoice.customer.address}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Invoice Date:</span>
                <span className="text-sm">{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
              </div>
              {invoice.dueDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span className="text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Warehouse:</span>
                <span className="text-sm">{invoice.warehouse.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created By:</span>
                <span className="text-sm">{invoice.createdBy.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoice.items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product.sku}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm">
                        {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                      <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  {index < invoice.items.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${invoice.totalAmount.toFixed(2)}</span>
              </div>
              {invoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Paid:</span>
                    <span>${invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Balance Due:</span>
                    <span>${(invoice.totalAmount - invoice.paidAmount).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {invoice.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{invoice.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </RoleGuard>
  )
}
