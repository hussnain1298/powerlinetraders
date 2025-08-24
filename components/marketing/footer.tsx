import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Zap className="h-8 w-8" />
              <span className="text-xl font-bold">Powerline Traders</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-md">
              Your trusted partner for high-quality generator parts and components. Serving businesses nationwide with
              reliable products and expert support.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/products" className="hover:text-primary-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=filters" className="hover:text-primary-foreground">
                  Filters
                </Link>
              </li>
              <li>
                <Link href="/products?category=plugs" className="hover:text-primary-foreground">
                  Spark Plugs
                </Link>
              </li>
              <li>
                <Link href="/products?category=belts" className="hover:text-primary-foreground">
                  Belts & Hoses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/about" className="hover:text-primary-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary-foreground">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/80">© 2025 Powerline Traders Pro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
