import { getProducts, getCategories } from "@/lib/database"
import ProductClientPage from "@/components/admin/products/ProductClientPage"
import { Suspense } from "react"

export default async function AdminProductsPage() {
  // Fetch initial data on the server
  const initialProducts = await getProducts()
  const initialCategories = await getCategories()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductClientPage 
        initialProducts={initialProducts} 
        initialCategories={initialCategories} 
      />
    </Suspense>
  )
}
