"use client"

import { notFound, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Play, X } from "lucide-react"
import { getProduct, incrementProductViews, getProducts } from "@/lib/database"
import type { Product } from "@/lib/database"
import ProductActions from "@/components/product-actions"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ProductPageProps {
  params: {
    id: string
  }
}

function getYouTubeEmbedUrl(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function isVideoUrl(url: string): boolean {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg")
  )
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string // useParams'tan gelen id'yi string olarak cast ediyoruz

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedImage, setSelectedImage] = useState<string>("/placeholder.svg")
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const fetchedProduct = await getProduct(id)
        if (!fetchedProduct) {
          notFound()
          return
        }
        setProduct(fetchedProduct)
        setSelectedImage(fetchedProduct.images[0] || "/placeholder.svg")

        // Increment views
        await incrementProductViews(id)

        // Fetch related products
        if (fetchedProduct.category_id) {
          const allProducts = await getProducts({ category_id: fetchedProduct.category_id, limit: 5 })
          setRelatedProducts(allProducts.filter((p) => p.id !== fetchedProduct.id))
        }
      } catch (err) {
        console.error("Error fetching product or related products:", err)
        setError("Failed to load product details.")
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id])

  const openGallery = (index: number) => {
    setCurrentGalleryIndex(index)
    setIsGalleryOpen(true)
  }

  const goToNextImage = () => {
    setCurrentGalleryIndex((prevIndex) => (prevIndex + 1) % (product?.images.length || 1))
  }

  const goToPreviousImage = () => {
    setCurrentGalleryIndex((prevIndex) => (prevIndex - 1 + (product?.images.length || 1)) % (product?.images.length || 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-slate-700">Loading product...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error || "Product not found."}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images/Videos Gallery */}
          <div className="space-y-6">
            {/* Main Image/Video Display */}
            <Card className="overflow-hidden cursor-pointer" onClick={() => openGallery(product.images.indexOf(selectedImage))}>
              <CardContent className="p-0">
                {product.images.length > 0 ? (
                  <div className="aspect-square bg-slate-100 flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-slate-100 flex items-center justify-center">
                    <div className="text-slate-400 text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <div>No Image Available</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden cursor-pointer hover:ring-2 ${selectedImage === image ? "ring-blue-500" : "ring-transparent"}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-slate-100">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Video Section */}
            {product.videos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Product Videos
                </h3>
                <div className="grid gap-4">
                  {product.videos.map((video, index) => {
                    const embedUrl = getYouTubeEmbedUrl(video)

                    if (embedUrl) {
                      return (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="aspect-video">
                              <iframe
                                src={embedUrl}
                                title={`${product.name} - Video ${index + 1}`}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    } else if (isVideoUrl(video)) {
                      return (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="aspect-video">
                              <video controls className="w-full h-full" src={video}>
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    } else {
                      return (
                        <Card key={index} className="p-4">
                          <a
                            href={video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <Play className="h-4 w-4" />
                            External Video Link {index + 1}
                          </a>
                        </Card>
                      )
                    }
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
                {product.badge && (
                  <Badge variant="secondary" className="text-sm">
                    {product.badge}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{product.views} views</span>
                </div>
                <div>
                  Category: <span className="font-medium">{product.category_name}</span>
                </div>
                <div>
                  By: <span className="font-medium">{product.manufacturer}</span>
                </div>
              </div>

              <div className="text-2xl font-bold text-blue-600 mb-6">{product.price}</div>
            </div>

            {/* Action Buttons */}
            <ProductActions pdfDocument={product.pdf_document} />

            <Separator />

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Product Details */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Product Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Category:</span>
                  <span className="ml-2 font-medium">{product.category_name}</span>
                </div>
                <div>
                  <span className="text-slate-600">Manufacturer:</span>
                  <span className="ml-2 font-medium">{product.manufacturer}</span>
                </div>
                <div>
                  <span className="text-slate-600">Status:</span>
                  <Badge variant={product.status === "active" ? "default" : "secondary"} className="ml-2">
                    {product.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-600">Views:</span>
                  <span className="ml-2 font-medium">{product.views}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Interested in this product?</h3>
                <p className="text-slate-700 mb-4">Contact us for detailed information, pricing, and availability.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 h-10 px-4 py-2"
                  >
                    Contact Sales Team
                  </a>
                  <a
                    href="https://wa.me/905324196722"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Request Technical Specs
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rich Description Section */}
        {product.rich_description && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Overview</h2>
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {product.rich_description}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Technical Specs and Additional Info Tabs */}
        {(product.technical_specs.length > 0 || product.additional_info.length > 0) && (
          <div className="mt-16">
            <Tabs defaultValue={product.technical_specs.length > 0 ? "technical-specs" : "additional-info"}>
              <TabsList className="grid w-full grid-cols-2">
                {product.technical_specs.length > 0 && (
                  <TabsTrigger value="technical-specs">Technical Specifications</TabsTrigger>
                )}
                {product.additional_info.length > 0 && (
                  <TabsTrigger value="additional-info">Additional Information</TabsTrigger>
                )}
              </TabsList>
              {product.technical_specs.length > 0 && (
                <TabsContent value="technical-specs" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Technical Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.technical_specs.map((spec, index) => (
                          <div key={index}>
                            <p className="text-slate-600 font-medium">{spec.title}:</p>
                            <p className="text-slate-800">{spec.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {product.additional_info.length > 0 && (
                <TabsContent value="additional-info" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h3>
                      <div className="space-y-4">
                        {product.additional_info.map((info, index) => (
                          <div key={index}>
                            <h4 className="font-semibold text-slate-900">{info.title}</h4>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {info.content}
                            </ReactMarkdown>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                  <Card className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-slate-100 flex items-center justify-center">
                        {relatedProduct.images && relatedProduct.images.length > 0 ? (
                          <img
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-slate-400">No Image</div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">{relatedProduct.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{relatedProduct.category_name}</p>
                        <p className="text-blue-600 font-medium mt-2">{relatedProduct.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="absolute top-4 right-4 z-10">
            <DialogTitle className="sr-only">Product Image Gallery</DialogTitle> {/* Hidden title for accessibility */}
            <Button variant="ghost" size="icon" onClick={() => setIsGalleryOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {product.images && product.images.length > 0 && (
              <>
                <img
                  src={product.images[currentGalleryIndex]}
                  alt={`${product.name} - Gallery Image ${currentGalleryIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={goToPreviousImage}
                    >
                      {"<"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={goToNextImage}
                    >
                      {">"}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 p-2">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer ${index === currentGalleryIndex ? "bg-blue-500" : "bg-gray-400"}`}
                onClick={() => setCurrentGalleryIndex(index)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
