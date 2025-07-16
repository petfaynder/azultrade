import { type NextRequest, NextResponse } from "next/server"
import { incrementBlogLikes } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await incrementBlogLikes(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error liking blog post:", error)
    return NextResponse.json({ error: "Failed to like blog post" }, { status: 500 })
  }
}
