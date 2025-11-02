import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, Globe, Users, Award, TrendingUp, Eye, Heart, CalendarDays, Tag, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getProducts, getBlogPosts } from "@/lib/database"
import { FadeInSection } from "@/components/fade-in-section"

async function getFeaturedProducts() {
  try {
    console.log("🔍 Fetching featured products for homepage...")
    const products = await getProducts({ is_featured: true })
    console.log(`✅ Fetched ${products.length} featured products for homepage`)
    return products.slice(0, 3) // Get first 3 featured products
  } catch (error) {
    console.error("❌ Error fetching featured products:", error)
    return []
  }
}

async function getLatestBlogPosts() {
  try {
    console.log("🔍 Fetching latest blog posts for homepage...")
    const posts = await getBlogPosts({ limit: 3 }) // Get latest 3 posts
    console.log(`✅ Fetched ${posts.length} latest blog posts for homepage`)
    return posts
  } catch (error) {
    console.error("❌ Error fetching latest blog posts:", error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const latestBlogPosts = await getLatestBlogPosts()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FadeInSection>
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
                    Global Trade Solutions
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Connecting
                    <span className="text-blue-400"> Global Markets</span>
                    <br />
                    with Quality Products
                  </h1>
                  <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                    Discover premium industrial equipment, machinery, and products from trusted manufacturers worldwide.
                    Your gateway to international trade and business growth.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg w-full">
                      Explore Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg w-full bg-transparent"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">500+</div>
                    <div className="text-blue-100">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">50+</div>
                    <div className="text-blue-100">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">1000+</div>
                    <div className="text-blue-100">Happy Clients</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Image
                      src="/heroplaceholder.png"
                      alt="Global Trade"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover rounded-2xl opacity-90"
                      priority
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Features Section */}
      <FadeInSection delay={0.2}>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why Choose Azul Global Trade?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We connect businesses worldwide with premium products and reliable trading solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Global Network</h3>
                  <p className="text-slate-600">Access to manufacturers and suppliers from over 50 countries worldwide</p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Quality Assured</h3>
                  <p className="text-slate-600">All products are verified and meet international quality standards</p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Expert Support</h3>
                  <p className="text-slate-600">Dedicated trade specialists to guide you through every step</p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Growth Focused</h3>
                  <p className="text-slate-600">Solutions designed to scale with your business needs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Partners Section */}
      <FadeInSection delay={0.4}>
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden py-20">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12">Our Trusted Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-center">
              <Image src="/partners/GlobalCargo.svg" alt="GlobalCargo Logo" width={150} height={60} className="h-12 w-auto mx-auto opacity-80 hover:opacity-100 transition-opacity" />
              <Image src="/partners/TradeNet.svg" alt="TradeNet Logo" width={150} height={60} className="h-12 w-auto mx-auto opacity-80 hover:opacity-100 transition-opacity" />
              <Image src="/partners/SeaLane.svg" alt="SeaLane Logo" width={150} height={60} className="h-12 w-auto mx-auto opacity-80 hover:opacity-100 transition-opacity" />
              <Image src="/partners/AirWay.svg" alt="AirWay Logo" width={150} height={60} className="h-12 w-auto mx-auto opacity-80 hover:opacity-100 transition-opacity" />
              <Image src="/partners/TerraLogistics.svg" alt="TerraLogistics Logo" width={150} height={60} className="h-12 w-auto mx-auto opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Featured Products Section */}
      <FadeInSection delay={0.6}>
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Featured Products</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Discover our most popular and high-quality products from trusted manufacturers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-slate-100 overflow-hidden">
                        {product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📦</div>
                              <div>No Image</div>
                            </div>
                          </div>
                        )}
                      </div>
                      {product.badge && (
                        <Badge className="absolute top-4 left-4 bg-blue-600 text-white">{product.badge}</Badge>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">{product.category_name}</p>
                        <p className="text-slate-500 text-sm">by {product.manufacturer}</p>
                      </div>

                      {product.rich_description && (
                        <p className="text-slate-600 text-sm line-clamp-2">{product.rich_description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">{product.price}</div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {product.views}
                          </div>
                          {product.images.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.images.length - 1} photos
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/products/${product.id}`} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
                        </Link>
                        <a
                          href="https://wa.me/905324196722"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          Quote
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Latest Blog Posts Section */}
      {latestBlogPosts.length > 0 && (
        <FadeInSection delay={0.8}>
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Latest Insights & News</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Stay updated with the latest trends, industry news, and company announcements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestBlogPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-slate-100 overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 space-y-4">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {post.category}
                        </Badge>
                        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(post.publish_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {post.author}
                          </div>
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <Button variant="outline" className="w-full">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="px-8 bg-transparent">
                    View All Blog Posts
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

      {/* Testimonials Section */}
      <FadeInSection delay={1.0}>
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Hear from businesses that have achieved global success with Azul Global Trade
              </p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <p className="text-slate-700 italic">
                    "Azul Global Trade transformed our sourcing process. Their network and quality assurance are
                    unmatched. Highly recommended!"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder-user.jpg"
                      alt="Client 1"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Jane Doe</p>
                      <p className="text-sm text-slate-600">CEO, Global Innovations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-8 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <p className="text-slate-700 italic">
                    "Thanks to Azul, we expanded into new markets effortlessly. Their expert support made all the
                    difference."
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder-user.jpg"
                      alt="Client 2"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">John Smith</p>
                      <p className="text-sm text-slate-600">Director, Apex Manufacturing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-8 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <p className="text-slate-700 italic">
                    "Reliable, efficient, and professional. Azul Global Trade is our go-to partner for international
                    sourcing."
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder-user.jpg"
                      alt="Client 3"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Emily White</p>
                      <p className="text-sm text-slate-600">Procurement Manager, Tech Solutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>
 
      {/* How It Works Section */}
      <FadeInSection delay={1.2}>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our streamlined process ensures a smooth and efficient global trade experience
              </p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 text-3xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Submit Your Request</h3>
                  <p className="text-slate-600">
                    Tell us your product needs and specifications through our easy-to-use platform.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center p-8 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-3xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Global Sourcing & Matching</h3>
                  <p className="text-slate-600">
                    We leverage our extensive network to find the best manufacturers and suppliers for you.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center p-8 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600 text-3xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Secure Transaction & Delivery</h3>
                  <p className="text-slate-600">
                    Ensure secure payments and timely delivery with our end-to-end logistics support.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>
 
      {/* FAQ Section */}
      <FadeInSection delay={1.4}>
        <section className="py-20 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Find answers to common questions about our services and global trade
              </p>
            </div>
 
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                  What types of products do you offer?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700">
                  We specialize in a wide range of industrial equipment, machinery, and raw materials. Our catalog
                  includes products for manufacturing, construction, agriculture, and more.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                  How do you ensure product quality?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700">
                  We have a rigorous quality assurance process, including supplier vetting, product inspections, and
                  adherence to international standards.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                  What countries do you operate in?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700">
                  Azul Global Trade has a vast network spanning over 50 countries, facilitating trade across continents.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                  How can I get a quote for a product?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700">
                  You can request a quote directly from any product page or by contacting our sales team through the
                  "Contact Sales" button.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </FadeInSection>
 
      {/* CTA Section */}
      <FadeInSection delay={1.6}>
        <section className="py-20 bg-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Expand Your Business Globally?</h2>
              <p className="text-xl text-blue-100">
                Join thousands of businesses that trust Azul Global Trade for their international sourcing needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-blue-900 hover:bg-blue-50 px-8 h-12 text-lg w-full"
                  >
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-900 px-8 h-12 text-lg w-full bg-transparent"
                  >
                    Schedule Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  )
}
