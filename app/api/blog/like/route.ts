import { type NextRequest, NextResponse } from "next/server"
import { incrementBlogLikes } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    // This function is in database.ts, it should handle the increment logic
    await incrementBlogLikes(id)
    
    // We might want to return the new like count, but for now, a success message is fine.
    // The client-side will optimistically update the UI.
    return NextResponse.json({ message: "Like count incremented" }, { status: 200 })
  } catch (error) {
    console.error("API Error incrementing blog likes:", error)
    return NextResponse.json({ error: "Failed to increment likes" }, { status: 500 })
  }
}