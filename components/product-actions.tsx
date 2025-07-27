"use client"

import { Button } from "@/components/ui/button"
import { Heart, Share2, FileText } from "lucide-react"
import React from "react"
import { Product } from "@/lib/database"
import { QuoteRequestDialog } from "./quote-request-dialog"

interface ProductActionsProps {
  product: Product
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const { pdf_document } = product

  const handleAddToWishlist = () => {
    alert("Add to Wishlist clicked!")
    // Implement actual wishlist logic here
  }

  const handleShare = () => {
    alert("Share clicked!")
    // Implement actual share logic here
  }


  return (
    <div className="flex flex-wrap gap-3">
      <QuoteRequestDialog product={product}>
        <Button size="lg" className="text-lg h-12 px-8 py-4">
          Request Quote
        </Button>
      </QuoteRequestDialog>
      <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
        <Heart className="h-4 w-4 mr-2" />
        Add to Wishlist
      </Button>
      <Button variant="outline" size="lg" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      {pdf_document && (
        <Button variant="outline" size="lg" onClick={() => window.open(pdf_document, "_blank")}>
          <FileText className="h-4 w-4 mr-2" />
          View Catalog
        </Button>
      )}
    </div>
  )
}

export default ProductActions