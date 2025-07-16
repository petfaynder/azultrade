import Link from "next/link"
import { Globe, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Azul Global Trade</h3>
                <p className="text-blue-200 text-sm">Turkish Export Excellence</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Leading Turkish export company connecting premium manufacturers with global markets. Quality, reliability,
              and innovation across 50+ countries worldwide.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-blue-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-blue-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-blue-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-blue-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Services", href: "/services" },
                { name: "About Us", href: "/about" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-300 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2">
              {[
                { name: "Global Market Access", href: "/services/global-market-access" },
                { name: "Quality Assurance", href: "/services/quality-assurance" },
                { name: "Logistics Excellence", href: "/services/logistics-excellence" },
                { name: "Export Documentation", href: "/services/export-documentation" },
                { name: "Technical Support", href: "/services/technical-support" },
                { name: "Custom Solutions", href: "/services/custom-solutions" },
              ].map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="text-slate-300 hover:text-white transition-colors duration-200">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-slate-300">
                  Istanbul, Turkey
                  <br />
                  Export Business Center
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-slate-300">+90 555 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-slate-300">info@azulglobaltrade.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2024 Azul Global Trade. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-slate-400 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
