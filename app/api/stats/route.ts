import { type NextRequest, NextResponse } from "next/server"
import { getStats } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const stats = await getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
