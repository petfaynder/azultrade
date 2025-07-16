import { type NextRequest, NextResponse } from "next/server"
import { getBlogPostBySlug, incrementBlogViews } from "@/lib/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const post = await getBlogPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    
    // Don't wait for this to finish
    incrementBlogViews(post.id);

    return NextResponse.json(post)
  } catch (error) {
    console.error(`API Error fetching blog post by slug ${params.slug}:`, error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}