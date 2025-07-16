import { type NextRequest, NextResponse } from "next/server"
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/database"

// GET a single blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    const post = await getBlogPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error(`API Error fetching blog post by ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}


// UPDATE a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    // Basic validation
    if (!id || !body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Post ID and update data are required" }, { status: 400 })
    }
    
    // If the title is updated, generate a new slug
    if (body.title) {
        const generateSlug = (title: string) => {
            return title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
        };
        body.slug = generateSlug(body.title);
    }

    const updatedPost = await updateBlogPost(id, body)

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error(`API Error updating blog post ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

// DELETE a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await deleteBlogPost(id);

        return NextResponse.json({ message: "Blog post deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(`API Error deleting blog post ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
    }
}
