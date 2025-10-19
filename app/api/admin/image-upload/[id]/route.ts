import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const supabase = createAdminClient();

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { alt_text } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('media_library')
      .update({ alt_text })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Backend: Database error in PATCH /api/admin/image-upload/${id}:`, error);
      return NextResponse.json({ error: `Failed to update alt text: ${error.message}` }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
    }
    console.log(`Backend: Successfully updated alt text for image ID: ${id}`);
    return NextResponse.json({ message: 'Alt text updated successfully.', mediaItem: data }, { status: 200 });

  } catch (error: any) {
    console.error("Backend: API Error in PATCH /api/admin/image-upload:", error);
    return NextResponse.json({ error: `Failed to update alt text: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
