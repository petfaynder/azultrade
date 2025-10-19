import { getProducts, getCategories } from "@/lib/database"
import ProductClientPage from "@/components/admin/products/ProductClientPage"
import { Suspense } from "react"
 
export const dynamic = 'force-dynamic'
 
 export default async function AdminProductsPage() {
   // Fetch initial data on the server
  // Her istekte veriyi yeniden çekmek için revalidate: 0 kullanıldı
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
