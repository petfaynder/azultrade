import { type NextRequest, NextResponse } from "next/server"
import { getProduct, updateProduct, deleteProduct } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    console.log(`API: GET /api/products/${id} called`)

    const product = await getProduct(id)

    if (!product) {
      console.log(`API: Product ${id} not found`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log(`API: Successfully fetched product: ${product.name}`)
    return NextResponse.json(product)
  } catch (error) {
    console.error(`API Error in GET /api/products/${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    console.log(`API: PUT /api/products/${id} called`)

    const body = await request.json()
    console.log("API: Update request body:", body)

    // Prepare update data
    const updateData = {
      ...(body.name && { name: body.name }),
      ...(body.category_id && { category_id: body.category_id }),
      ...(body.manufacturer && { manufacturer: body.manufacturer }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.rich_description !== undefined && { rich_description: body.rich_description }),
      ...(body.features !== undefined && { features: Array.isArray(body.features) ? body.features : [] }),
      ...(body.images !== undefined && { images: Array.isArray(body.images) ? body.images : [] }),
      ...(body.videos !== undefined && { videos: Array.isArray(body.videos) ? body.videos : [] }),
      ...(body.pdf_document !== undefined && { pdf_document: body.pdf_document }),
      ...(body.technical_specs !== undefined && { technical_specs: Array.isArray(body.technical_specs) ? body.technical_specs : [] }),
      ...(body.additional_info !== undefined && { additional_info: Array.isArray(body.additional_info) ? body.additional_info : [] }),
      ...(body.badge !== undefined && { badge: body.badge }),
      ...(body.status && { status: body.status }),
      ...(body.is_featured !== undefined && { is_featured: body.is_featured }),
    }

    console.log("API: Updating product with data:", updateData)

    const updatedProduct = await updateProduct(id, updateData)

    console.log(`API: Product ${id} updated successfully`)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(`API Error in PUT /api/products/${id}:`, error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    console.log(`API: DELETE /api/products/${id} called`)

    await deleteProduct(id)

    console.log(`API: Product ${id} deleted successfully`)
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error(`API Error in DELETE /api/products/${id}:`, error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
