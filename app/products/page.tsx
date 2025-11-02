"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type { Product, Category } from "@/lib/database"
import { FadeInSection } from "@/components/fade-in-section"
import { useCompare } from "@/contexts/CompareContext"
 
export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productsRef = useRef<HTMLDivElement>(null)
  const { addToCompare } = useCompare()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [sortBy, setSortBy] = useState("name-asc")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await fetch("/api/categories?sortBy=order&sortOrder=asc")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (selectedCategoryId && selectedCategoryId !== "all") {
        params.append("category", selectedCategoryId)
      }

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (sortBy) {
        params.append("sortBy", sortBy.split('-')[0]);
        params.append("sortOrder", sortBy.split('-')[1]);
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all"
    setSelectedCategoryId(categoryFromUrl)
  }, [searchParams])

  useEffect(() => {
    if (selectedCategoryId !== "all" || searchTerm) {
      fetchProducts()
    } else {
      setProducts([])
      setLoading(false)
    }
    if (selectedCategoryId !== "all") {
      productsRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedCategoryId, searchTerm, sortBy])
 
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    if (categoryId && categoryId !== "all") {
      router.replace(`/products?category=${categoryId}`)
    } else {
      router.replace("/products?category=all")
    }
  }

  const handleSearch = () => {
    fetchProducts()
  }

  const stripHtml = (html: string) => {
    if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }
    return html;
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FadeInSection>
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">🚜 Our Products</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Premium Turkish Export Products</h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Discover our extensive catalog of high-quality products from Turkey's leading manufacturers, designed to
                meet global market needs across multiple industries.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Categories Section */}
      <FadeInSection delay={0.2}>
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Explore Categories</h2>
            {categories.length === 0 ? (
              <div className="text-center text-gray-500">No categories available.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Link key={category.id} href={`/products?category=${category.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">No Image</div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </FadeInSection>

      {/* Products Grid */}
      <FadeInSection delay={0.4}>
        <section ref={productsRef} className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategoryId && selectedCategoryId !== "all" ? `${categories.find(cat => cat.id === selectedCategoryId)?.name || "Selected"} Category` : "All Products"}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full md:w-[200px] h-12">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
                <Select onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full md:w-[200px] h-12">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="views-desc">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : products.length === 0 && (selectedCategoryId !== "all" || searchTerm) ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or browse other categories.</p>
              </div>
            ) : products.length === 0 && selectedCategoryId === "all" && !searchTerm ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a category to view products</h3>
                <p className="text-gray-500">Choose a category from the dropdown or search for products.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative">
                        <Image
                          src={product.images && product.images.length > 0 ? product.images[0].url : "/placeholder.svg"}
                          alt={product.images && product.images.length > 0 ? product.images[0].alt : product.name}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        {product.badge && (
                          <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{product.badge}</Badge>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {product.category_name}
                          </Badge>
                          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">by {product.manufacturer}</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{stripHtml(product.rich_description || "").substring(0, 100)}...</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Key Features:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-blue-600">{product.price}</span>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{product.views} views</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href="https://wa.me/905324196722"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 bg-blue-600 hover:bg-blue-700 h-10 px-4 py-2"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              WhatsApp
                            </a>
                            <Link href={`/products/${product.slug}`} className="flex-1">
                              <Button variant="outline" className="w-full bg-transparent">
                                Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="secondary" className="flex-1" onClick={() => addToCompare(product)}>
                              Compare
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection delay={0.6}>
        <section className="py-20 bg-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We work with over 100 Turkish manufacturers. Contact us with your specific requirements and we'll find the
              perfect products for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/905324196722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-blue-900 hover:bg-blue-50 h-12 px-8 py-4"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Custom Request
              </a>
              <a
                href="https://wa.me/905324196722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-white text-white hover:bg-white hover:text-blue-900 bg-transparent h-12 px-8 py-4"
              >
                View All Manufacturers
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  )
}
