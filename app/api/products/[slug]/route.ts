import { type NextRequest, NextResponse } from "next/server"
import { getProductBySlug, updateProduct, deleteProduct, getProduct } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  try {
    console.log(`API: GET /api/products/${slug} called`)

    const product = await getProductBySlug(slug)

    if (!product) {
      console.log(`API: Product with slug ${slug} not found`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log(`API: Successfully fetched product: ${product.name}`)
    return NextResponse.json(product)
  } catch (error) {
    console.error(`API Error in GET /api/products/${slug}:`, error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug: currentSlug } = params
  try {
    console.log(`API: PUT /api/products/${currentSlug} called`)

    const body = await request.json()
    console.log("API: Update request body:", body);

    // Find product by slug to get its ID for update
    console.log(`API: Searching for product with slug: ${currentSlug}`);
    const productToUpdate = await getProductBySlug(currentSlug);
    if (!productToUpdate) {
      console.log(`API: Product with slug ${currentSlug} not found for update.`);
      return NextResponse.json({ error: "Product to update not found" }, { status: 404 });
    }
    const { id } = productToUpdate; // id'yi burada tanımla
    console.log(`API: Found product ID: ${id} for slug: ${currentSlug}`);

    // Prepare update data
    const updateData: { [key: string]: any } = { ...body }; // body'den gelen tüm alanları kopyala
    console.log("API: Initial update data:", updateData);

    // Eğer ürün adı güncelleniyorsa, slug'ı da güncelle
    if (body.name) {
      const baseSlug = slugify(body.name);
      let newSlug = baseSlug;
      let counter = 2;
      let slugExists = true;

      console.log(`API: Product name updated, generating new slug for: ${body.name}`);
      while (slugExists) {
        console.log(`API: Checking slug uniqueness for: ${newSlug}`);
        const { data: existingProduct, error: checkError } = await supabase
          .from('products')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', id) // Kendisi hariç diğer ürünlerde kontrol et
          .maybeSingle();

        if (checkError) {
          console.error(`API Error: Slug benzersizliği kontrol edilirken hata oluştu "${newSlug}":`, checkError.message);
          newSlug = `${baseSlug}-${Date.now()}`; // Fallback
          slugExists = false;
        } else if (!existingProduct) {
          console.log(`API: Slug "${newSlug}" is unique.`);
          slugExists = false;
        } else {
          console.log(`API: Slug "${newSlug}" already exists, trying next counter.`);
          newSlug = `${baseSlug}-${counter}`;
          counter++;
        }
      }
      updateData.slug = newSlug;
      console.log(`API: Final new slug generated: ${updateData.slug}`);
    }

    console.log("API: Final update data before calling updateProduct:", updateData);
    console.log(`API: Calling updateProduct with ID: ${id} and data:`, updateData);
    const updatedProduct = await updateProduct(id, updateData);
    console.log(`API: updateProduct returned:`, updatedProduct);

    console.log(`API: Product ${id} updated successfully`)
    revalidatePath("/admin/products")
    revalidatePath("/products")
    revalidatePath(`/products/${updatedProduct.slug}`) // Revalidate with the new slug
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(`API Error in PUT /api/products/${currentSlug}:`, error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  try {
    console.log(`API: DELETE /api/products/${slug} called`)

    // Find product by slug to get its ID for deletion
    const productToDelete = await getProductBySlug(slug);
    if (!productToDelete) {
      return NextResponse.json({ error: "Product to delete not found" }, { status: 404 });
    }
    const { id } = productToDelete;

    await deleteProduct(id)

    console.log(`API: Product ${id} (slug: ${slug}) deleted successfully`)
    revalidatePath("/admin/products")
    revalidatePath("/products")
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error(`API Error in DELETE /api/products/${slug}:`, error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
