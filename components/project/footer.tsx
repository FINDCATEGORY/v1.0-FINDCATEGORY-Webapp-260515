import Link from "next/link"
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Genai
            </Link>
            <p className="mt-4 text-sm text-foreground/60 mb-6">
              Stay updated with the latest AI innovations, industry insights, and exclusive offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-2.5 rounded-l-full border border-border bg-background text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-r-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">PAGES</h4>
            <nav className="flex flex-col gap-3">
              {["About us", "Works", "Services", "Blogs", "FAQ"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm text-foreground/60 hover:text-accent transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resource */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">RESOURCE</h4>
            <nav className="flex flex-col gap-3">
              {["Reviews", "Pricing", "Contact us", "Licensing", "Style Guide"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm text-foreground/60 hover:text-accent transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">OUR ADDRESS</h4>
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="h-4 w-4 text-foreground/60 mt-0.5" />
              <p className="text-sm text-foreground/60">1847 Innovation Drive, Suite 300, San Francisco, CA 94103</p>
            </div>

            <h4 className="text-sm font-semibold text-foreground mb-4">CONTACT US</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-foreground/60" />
                <a href="tel:+14159876543" className="text-sm text-foreground/60 hover:text-accent transition-colors">
                  +(415) 987-6543
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-foreground/60" />
                <a
                  href="mailto:info@example.com"
                  className="text-sm text-foreground/60 hover:text-accent transition-colors"
                >
                  info@example.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/50">©2025 Genai. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-foreground/50 hover:text-accent transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-sm text-foreground/50 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-foreground/50 hover:text-accent transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
