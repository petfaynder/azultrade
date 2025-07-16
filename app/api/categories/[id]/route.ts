import { type NextRequest, NextResponse } from "next/server"
import { getCategory, updateCategory, deleteCategory } from "@/lib/database"
import { slug } from "github-slugger"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    console.log(`API: GET /api/categories/${id} called`)

    const category = await getCategory(id)

    if (!category) {
      console.log(`API: Category ${id} not found`)
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    console.log(`API: Successfully fetched category: ${category.name}`)
    return NextResponse.json(category)
  } catch (error) {
    console.error(`API Error in GET /api/categories/${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    console.log(`API: PUT /api/categories/${id} called`)

    const body = await request.json()
    console.log("API: Update category request body:", body)

    const updateData: {
      name?: string
      slug?: string
      description?: string
      image?: string
      order?: number
    } = {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.order !== undefined && { order: body.order }),
    }

    if (body.name) {
      updateData.slug = slug(body.name)
    }

    console.log("API: Updating category with data:", updateData)

    const updatedCategory = await updateCategory(id, updateData)

    console.log(`API: Category ${id} updated successfully`)
    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error(`API Error in PUT /api/categories/${id}:`, error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    console.log(`API: DELETE /api/categories/${id} called`)

    await deleteCategory(id)

    console.log(`API: Category ${id} deleted successfully`)
    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error(`API Error in DELETE /api/categories/${id}:`, error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}