import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Truck,
  FileText,
  Users,
  Search,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Award,
  Factory,
  Apple,
  Wheat,
} from "lucide-react"
import { FadeInSection } from "@/components/fade-in-section"

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FadeInSection>
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 text-lg">
                🚀 Our Services
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">Comprehensive Export Solutions for All Industries</h1>
              <p className="text-xl text-cyan-100 leading-relaxed">
                From sourcing to delivery, we provide end-to-end services that make international trade simple, secure,
                and successful across all product categories.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Main Services */}
      <FadeInSection>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Core Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need for successful international trade across multiple industries
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border-t-4 border-t-blue-600">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Product Sourcing</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We identify and connect you with the right Turkish manufacturers based on your specific requirements
                    and quality standards across all industries.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Manufacturer verification
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Quality assessment
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Price negotiation
                    </li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-10 px-4 py-2"
                  >
                    Learn More
                  </a>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-green-50/50 rounded-2xl border-t-4 border-t-green-600">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Quality Assurance</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Comprehensive quality control processes ensure all products meet international standards and your
                    specifications across all categories.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Pre-shipment inspection
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Certification verification
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Performance testing
                    </li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-10 px-4 py-2"
                  >
                    View Process
                  </a>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-cyan-50/50 rounded-2xl border-t-4 border-t-cyan-600">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Logistics & Shipping</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    End-to-end logistics management from Turkish ports to your destination, including customs clearance
                    for all product types.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Sea & air freight
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Customs clearance
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Door-to-door delivery
                    </li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-10 px-4 py-2"
                  >
                    Track Shipment
                  </a>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 rounded-2xl border-t-4 border-t-orange-600">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Documentation Support</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Complete handling of all export/import documentation and regulatory compliance requirements for all
                    industries.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Export licenses
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Certificates of origin
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Insurance documentation
                    </li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-10 px-4 py-2"
                  >
                    Get Started
                  </a>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-purple-50/50 rounded-2xl border-t-4 border-t-purple-600">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Financial Services</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Flexible payment solutions and trade finance options to facilitate smooth transactions across all
                    sectors.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Letter of credit
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Trade financing
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Payment protection
                    </li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-10 px-4 py-2"
                  >
                    Learn More
                  </a>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl border-t-4 border-t-emerald-600">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">After-Sales Support</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Ongoing support including spare parts sourcing, technical assistance, and warranty coordination across
                    all products.
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Spare parts supply
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Technical support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      Warranty management
                    </li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 h-10 px-4 py-2"
                  >
                    Get Support
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Industry Specializations */}
      <FadeInSection delay={0.2}>
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Industry Specializations</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized export services tailored to different industry requirements
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl group">
                <CardContent className="p-0 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Wheat className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Agricultural Sector</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Specialized services for agricultural machinery, equipment, and related products with deep industry
                    knowledge.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                    <li>• Technical specification verification</li>
                    <li>• Agricultural certification support</li>
                    <li>• Seasonal logistics planning</li>
                    <li>• Farmer training coordination</li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-10 px-4 py-2"
                  >
                    Learn More
                  </a>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl group">
                <CardContent className="p-0 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Apple className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Food Industry</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Comprehensive food export services including organic certification, cold chain logistics, and quality
                    control.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                    <li>• Food safety certification</li>
                    <li>• Cold chain management</li>
                    <li>• Halal/Kosher documentation</li>
                    <li>• Shelf life optimization</li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-10 px-4 py-2"
                  >
                    Learn More
                  </a>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl group">
                <CardContent className="p-0 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Factory className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Industrial Sector</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Industrial equipment export services with technical support, installation guidance, and maintenance
                    coordination.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                    <li>• Technical documentation</li>
                    <li>• Installation support</li>
                    <li>• Maintenance planning</li>
                    <li>• Operator training</li>
                  </ul>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-10 px-4 py-2"
                  >
                    Learn More
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Service Process */}
      <FadeInSection delay={0.4}>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Service Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A streamlined approach to international trade across all industries
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Initial Consultation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We discuss your requirements, specifications, and budget to understand your needs across any industry.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Sourcing & Matching</h3>
                <p className="text-gray-600 leading-relaxed">
                  We identify suitable manufacturers and present you with the best options tailored to your industry.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Quality Verification</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive quality checks and documentation verification process for all product categories.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Delivery & Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure shipping and ongoing after-sales support for your peace of mind across all industries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Service Benefits */}
      <FadeInSection delay={0.6}>
        <section className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Why Our Services Make the Difference</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our comprehensive approach to international trade eliminates the complexities and risks typically
                  associated with global commerce across all industries.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-lg">Time Efficient</h4>
                      <p className="text-gray-600">
                        Streamlined processes save you weeks of research and negotiation across all sectors.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Shield className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-lg">Risk Mitigation</h4>
                      <p className="text-gray-600">
                        Comprehensive vetting reduces quality and delivery risks significantly.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <DollarSign className="h-8 w-8 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-lg">Cost Effective</h4>
                      <p className="text-gray-600">
                        Direct manufacturer relationships ensure competitive pricing across all industries.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Award className="h-8 w-8 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-lg">Quality Assured</h4>
                      <p className="text-gray-600">
                        Rigorous quality control ensures products meet international standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-10 shadow-2xl">
                  <h3 className="text-3xl font-bold text-blue-900 mb-6">Service Guarantee</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-lg">100% manufacturer verification</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-lg">Quality guarantee on all products</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-lg">On-time delivery commitment</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-lg">24/7 customer support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-lg">Complete documentation support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection delay={0.8}>
        <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Experience Our Services?</h2>
            <p className="text-xl text-cyan-100 mb-12 max-w-2xl mx-auto">
              Let us handle the complexities of international trade while you focus on growing your business across any
              industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://wa.me/905324196722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-12"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Get Started Today
              </a>
              <a
                href="https://wa.me/905324196722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-white/30 text-white hover:bg-white hover:text-blue-900 bg-white/10 backdrop-blur-sm px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-12"
              >
                Request Service Quote
                <ArrowRight className="ml-3 h-6 w-6" />
              </a>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  )
}
