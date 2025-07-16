"use client"

import { Button } from "@/components/ui/button"
import { Heart, Share2, FileText } from "lucide-react"
import React from "react"

interface ProductActionsProps {
  pdfDocument?: string | null
}

const ProductActions: React.FC<ProductActionsProps> = ({ pdfDocument }) => {
  const handleRequestQuote = () => {
    alert("Request Quote clicked!")
    // Implement actual quote request logic here
  }

  const handleAddToWishlist = () => {
    alert("Add to Wishlist clicked!")
    // Implement actual wishlist logic here
  }

  const handleShare = () => {
    alert("Share clicked!")
    // Implement actual share logic here
  }

  const handleViewCatalog = () => {
    if (pdfDocument) {
      window.open(pdfDocument, "_blank")
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="https://wa.me/905324196722"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 h-12 px-8 py-4"
      >
        Request Quote
      </a>
      <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
        <Heart className="h-4 w-4 mr-2" />
        Add to Wishlist
      </Button>
      <Button variant="outline" size="lg" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      {pdfDocument && (
        <Button variant="outline" size="lg" onClick={handleViewCatalog}>
          <FileText className="h-4 w-4 mr-2" />
          View Catalog
        </Button>
      )}
    </div>
  )
}

export default ProductActions