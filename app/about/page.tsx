import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Globe, MessageCircle, ArrowRight, Factory, Wheat, Apple } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FadeInSection } from "@/components/fade-in-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FadeInSection>
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 text-lg">
                🌍 About Azul Global Trade
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">Bridging Turkish Excellence with Global Markets</h1>
              <p className="text-xl text-cyan-100 leading-relaxed">
                Since our establishment, we have been dedicated to connecting world-class Turkish manufacturers with
                international buyers, facilitating seamless trade relationships across continents and diverse industries.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Our Story */}
      <FadeInSection delay={0.2}>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Our Story</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Azul Global Trade was founded with a vision to showcase Turkey's exceptional manufacturing capabilities
                  across multiple industries to the world. Our name "Azul," meaning ocean blue in Portuguese, represents
                  the vast opportunities and endless horizons we create for our partners.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We recognized that many high-quality Turkish manufacturers lacked the international reach to connect
                  with global buyers. From agricultural machinery to premium food products, from industrial equipment to
                  consumer goods - we became the bridge that connects these two worlds.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                    <div className="text-4xl font-bold text-blue-600 mb-2">2019</div>
                    <div className="text-gray-600 font-medium">Founded</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                    <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                    <div className="text-gray-600 font-medium">Countries Served</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/abouthero.png"
                  alt="Our Story"
                  width={700}
                  height={600}
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 shadow-2xl">
                  <div className="text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-bold">Global Reach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Our Values */}
      <FadeInSection delay={0.4}>
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do across all industries
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Trust & Reliability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Building lasting relationships through transparent communication and reliable service delivery across
                    all product categories.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Quality Excellence</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Partnering only with manufacturers who meet the highest international quality standards across all
                    industries.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Global Perspective</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Understanding diverse market needs and cultural nuances across different regions and industries.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Customer Focus</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Tailoring our services to meet the specific needs and requirements of each client across all sectors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Our Mission & Vision */}
      <FadeInSection delay={0.6}>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="p-10 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 border-2 rounded-3xl">
                <CardContent className="p-0">
                  <h3 className="text-3xl font-bold text-blue-900 mb-6">Our Mission</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To facilitate seamless international trade by connecting Turkish manufacturers with global buyers
                    across multiple industries, ensuring quality, reliability, and mutual success for all parties
                    involved.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-10 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 border-2 rounded-3xl">
                <CardContent className="p-0">
                  <h3 className="text-3xl font-bold text-green-900 mb-6">Our Vision</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To become the leading global platform for Turkish exports, recognized for our expertise, integrity,
                    and contribution to sustainable business development worldwide.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Product Categories */}
      <FadeInSection delay={0.8}>
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Product Categories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We specialize in connecting global buyers with premium Turkish products across diverse industries
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl group">
                <CardContent className="p-0 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Wheat className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Agricultural Machinery</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Premium tractors, feed mixers, harvesters, and smart farming equipment from leading Turkish
                    manufacturers.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li>• Feed Processing Equipment</li>
                    <li>• Tractors & Implements</li>
                    <li>• Harvesting Machinery</li>
                    <li>• Irrigation Systems</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl group">
                <CardContent className="p-0 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Apple className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Food Products</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Organic foods, traditional delicacies, dried fruits, nuts, honey, and premium Turkish food products.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li>• Organic Honey & Nuts</li>
                    <li>• Dried Fruits & Vegetables</li>
                    <li>• Traditional Delicacies</li>
                    <li>• Spices & Seasonings</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-2xl group">
                <CardContent className="p-0 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Factory className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Industrial Equipment</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Manufacturing equipment, processing machinery, and industrial solutions for various sectors.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li>• Manufacturing Equipment</li>
                    <li>• Processing Machinery</li>
                    <li>• Industrial Tools</li>
                    <li>• Automation Systems</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Why Choose Us */}
      <FadeInSection delay={1.0}>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose Azul Global Trade?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">What sets us apart in the global export industry</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold mb-4 text-blue-900">Extensive Network</h4>
                <p className="text-gray-600 leading-relaxed">
                  Direct relationships with over 150 Turkish manufacturers and buyers in 50+ countries across multiple
                  industries.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold mb-4 text-green-900">Quality Assurance</h4>
                <p className="text-gray-600 leading-relaxed">
                  Rigorous vetting process ensures all products meet international standards and certifications across all
                  categories.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold mb-4 text-orange-900">End-to-End Service</h4>
                <p className="text-gray-600 leading-relaxed">
                  Complete support from initial inquiry to final delivery, including logistics and documentation for all
                  product types.
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold mb-4 text-cyan-900">Competitive Pricing</h4>
                <p className="text-gray-600 leading-relaxed">
                  Direct manufacturer relationships enable us to offer competitive prices without compromising quality
                  across all sectors.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold mb-4 text-purple-900">Expert Knowledge</h4>
                <p className="text-gray-600 leading-relaxed">
                  Deep understanding of product specifications and international trade regulations across diverse
                  industries.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-semibold mb-4 text-yellow-900">24/7 Support</h4>
                <p className="text-gray-600 leading-relaxed">
                  Round-the-clock customer support to address any questions or concerns promptly across all time zones.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection delay={1.2}>
        <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Partner with Us?</h2>
            <p className="text-xl text-cyan-100 mb-12 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who trust Azul Global Trade for their Turkish product needs across
              multiple industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://wa.me/905324196722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-12"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Contact Us Today
              </a>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-blue-900 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  View Our Products
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  )
}
