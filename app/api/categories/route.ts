import { type NextRequest, NextResponse } from "next/server"
import { getCategories, createCategory } from "@/lib/database"
import { slug } from "github-slugger"

export async function GET(request: NextRequest) {
  try {
    console.log("API: GET /api/categories called")
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sortBy") || undefined
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined

    const categories = await getCategories({ sortBy, sortOrder })
    console.log(`API: Successfully fetched ${categories.length} categories`)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("API Error in GET /api/categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("API: POST /api/categories called")
    const body = await request.json()
    console.log("API: Create category request body:", body)

    const { name, description, image, order } = body

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const categoryDataToCreate = {
      name,
      slug: slug(name), // Generate slug from name
      description: description || null,
      image: image || null,
      order: order || 0,
    }
    console.log("API: Data to be sent to createCategory:", categoryDataToCreate)

    const newCategory = await createCategory(categoryDataToCreate)

    console.log("API: Category created successfully:", newCategory)
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error("API Error in POST /api/categories:", error)
    console.error("API: Full error object:", JSON.stringify(error, null, 2))
    console.error("API: Error message:", error.message)
    console.error("API: Error details:", error.details)
    console.error("API: Error hint:", error.hint)
    return NextResponse.json({ error: error.message || "Failed to create category", details: error.details || null }, { status: 500 })
  }
}