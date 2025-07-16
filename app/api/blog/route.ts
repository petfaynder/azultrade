import { type NextRequest, NextResponse } from "next/server"
import { getBlogPosts, createBlogPost } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const filters: { category?: string; search?: string } = {}
    if (category) filters.category = category
    if (search) filters.search = search

    console.log("API: Fetching blog posts with filters:", filters)
    const posts = await getBlogPosts(filters)
    console.log("API: Blog posts fetched successfully:", posts.length)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("API Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("API: Creating blog post with data:", body)

    // Validate required fields
    if (!body.title || !body.content || !body.author || !body.category) {
      console.error("API: Missing required fields")
      return NextResponse.json({ error: "Missing required fields: title, content, author, category" }, { status: 400 })
    }

    // Generate slug from title
    const slug = generateSlug(body.title);

    // Ensure status is set
    const postData = {
      ...body,
      slug,
      status: body.status || "published",
    }

    console.log("API: Final blog post data:", postData)

    const post = await createBlogPost(postData)
    console.log("API: Blog post created successfully:", post)

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("API Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
