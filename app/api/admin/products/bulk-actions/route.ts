import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { action, productIds } = await req.json()

    if (!action || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    if (action === "delete") {
      const { error } = await supabase.from("products").delete().in("id", productIds)

      if (error) {
        console.error("Error deleting products:", error)
        return NextResponse.json({ error: "Failed to delete products" }, { status: 500 })
      }

      return NextResponse.json({ message: "Products deleted successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}