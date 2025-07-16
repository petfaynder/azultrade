import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("🔍 Testing database connection...")

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("products")
      .select("count", { count: "exact", head: true })

    if (connectionError) {
      console.error("❌ Connection test failed:", connectionError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Database connection successful")

    // Test products table
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, images, videos, pdf_document")
      .limit(3)

    if (productsError) {
      console.error("❌ Products query failed:", productsError)
      return NextResponse.json(
        {
          success: false,
          error: "Products table query failed",
          details: productsError.message,
        },
        { status: 500 },
      )
    }

    // Test blog_posts table
    const { data: blogPosts, error: blogError } = await supabase.from("blog_posts").select("id, title, status").limit(3)

    if (blogError) {
      console.error("❌ Blog posts query failed:", blogError)
      return NextResponse.json(
        {
          success: false,
          error: "Blog posts table query failed",
          details: blogError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ All database tests passed")

    return NextResponse.json({
      success: true,
      message: "Database connection and queries successful",
      data: {
        productsCount: connectionTest?.length || 0,
        sampleProducts:
          products?.map((p) => ({
            id: p.id,
            name: p.name,
            hasImages: (p.images || []).length > 0,
            hasVideos: (p.videos || []).length > 0,
            hasPdf: !!p.pdf_document,
          })) || [],
        sampleBlogPosts:
          blogPosts?.map((b) => ({
            id: b.id,
            title: b.title,
            status: b.status,
          })) || [],
      },
    })
  } catch (error) {
    console.error("❌ Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
