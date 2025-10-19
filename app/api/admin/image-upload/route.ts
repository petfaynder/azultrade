import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server"; // Import the server-side admin client
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names

const supabase = createAdminClient(); // Use the server-side admin client

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[]; // Expecting 'images' for multiple files
    const altTexts = formData.getAll('altTexts') as string[]; // Expecting 'altTexts' for corresponding alt texts

    console.log('Backend: Received files:', files.map(f => f.name));
    console.log('Backend: Received alt texts:', altTexts);

    if (!files || files.length === 0) {
      console.error('Backend: No image files provided.');
      return NextResponse.json({ error: 'No image files provided.' }, { status: 400 });
    }

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const imageFile = files[i];
      const altText = altTexts[i] || ''; // Get corresponding alt text, default to empty string

      console.log(`Backend: Processing file ${i + 1}: ${imageFile.name}`);

      // Generate a unique file name
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `blog_images/${fileName}`; // Store in a 'blog_images' bucket or folder

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('azulglobaltrade') // Use the correct bucket name
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error(`Backend: Supabase Storage upload error for ${imageFile.name}:`, uploadError);
        // Continue with other files, but log the error
        continue;
      }
      console.log(`Backend: Uploaded ${imageFile.name} to storage.`);

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('azulglobaltrade') // Use the correct bucket name
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error(`Backend: Failed to get public URL for ${imageFile.name}.`);
        continue;
      }
      console.log(`Backend: Public URL for ${imageFile.name}: ${publicUrlData.publicUrl}`);

      const imageUrl = publicUrlData.publicUrl;

      // Save image metadata to media_library table
      const { data: dbData, error: dbError } = await supabase
        .from('media_library')
        .insert({ url: imageUrl, alt_text: altText, file_name: fileName })
        .select()
        .single();

      if (dbError) {
        console.error(`Backend: Database insert error for ${imageFile.name}:`, dbError);
        // Optionally delete the uploaded file from storage if DB insert fails
        await supabase.storage.from('azulglobaltrade').remove([filePath]); // Use the correct bucket name
        continue;
      }
      console.log(`Backend: Saved metadata for ${imageFile.name} to database.`);

      uploadedImages.push({
        id: dbData.id,
        url: dbData.url,
        alt_text: dbData.alt_text,
        file_name: dbData.file_name,
      });
    }

    if (uploadedImages.length === 0) {
      console.error('Backend: No images were successfully uploaded after processing.');
      return NextResponse.json({ error: 'No images were successfully uploaded.' }, { status: 500 });
    }

    console.log('Backend: Successfully processed and uploaded images:', uploadedImages.length);
    return NextResponse.json({ uploadedImages }, { status: 200 });

  } catch (error: any) {
    console.error("Backend: API Error in POST /api/admin/image-upload:", error);
    return NextResponse.json({ error: `Failed to upload image(s): ${error.message || JSON.stringify(error)}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Backend: Database error in GET /api/admin/image-upload:', error);
      return NextResponse.json({ error: `Failed to fetch media library: ${error.message}` }, { status: 500 });
    }
    console.log('Backend: Successfully fetched media library.');
    return NextResponse.json({ media: data }, { status: 200 });
  } catch (error: any) { // Explicitly type error
    console.error("Backend: API Error in GET /api/admin/image-upload:", error);
    return NextResponse.json({ error: `Failed to fetch media library: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
