import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const isFeatured = searchParams.get("is_featured")

    console.log("API: GET /api/products called with filters:", { category, search, isFeatured })

    const filters: { category?: string; search?: string; is_featured?: boolean } = {}
    if (category && category !== "all") filters.category = category
    if (search) filters.search = search
    if (isFeatured === "true") filters.is_featured = true

    const products = await getProducts(filters)

    console.log(`API: Successfully fetched ${products.length} products`)
    return NextResponse.json(products)
  } catch (error) {
    console.error("API Error in GET /api/products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("API: POST /api/products called")

    const body = await request.json()
    console.log("API: Request body:", body)

    // Validate required fields
    if (!body.name || !body.category_id || !body.manufacturer) {
      console.log("API: Missing required fields")
      return NextResponse.json({ error: "Missing required fields: name, category_id, manufacturer" }, { status: 400 })
    }

    // Prepare product data
    const productData = {
      name: body.name,
      category_id: body.category_id, // category yerine category_id kullanıldı
      manufacturer: body.manufacturer,
      price: body.price || "Contact for Price",
      rich_description: body.rich_description || "", // description yerine rich_description kullanıldı
      technical_specs: Array.isArray(body.technical_specs) ? body.technical_specs : [],
      additional_info: Array.isArray(body.additional_info) ? body.additional_info : [],
      features: Array.isArray(body.features) ? body.features : [],
      images: Array.isArray(body.images) ? body.images : [],
      videos: Array.isArray(body.videos) ? body.videos : [],
      pdf_document: body.pdf_document || null,
      badge: body.badge || null,
      status: body.status || "active",
      is_featured: body.is_featured || false,
    }

    console.log("API: Creating product with data:", productData)

    const newProduct = await createProduct(productData)

    console.log("API: Product created successfully:", newProduct.id)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("API Error in POST /api/products:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
