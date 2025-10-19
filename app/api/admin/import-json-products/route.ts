import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const jsonData = await request.json();
    const { products } = jsonData;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Geçersiz JSON: "products" dizisi bulunamadı' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const [index, product] of products.entries()) {
      try {
        // Zorunlu alanlar kontrolü
        if (!product.name || !product.manufacturer) {
          errors.push(`Ürün ${index + 1}: Eksik zorunlu alanlar (name, manufacturer)`);
          continue;
        }

        // Price kontrolü - null ise varsayılan değer
        const price = product.price || 'Fiyat Sorunuz';

        // Kategori ID'sini null olarak ayarla (manuel atama için)
        const categoryId = null;

        // technical_specs dönüşümü: { key: value } -> [{ title: key, value: value }]
        const technicalSpecsArray = product.technical_specs && typeof product.technical_specs === 'object' && !Array.isArray(product.technical_specs)
          ? Object.entries(product.technical_specs).map(([title, value]) => ({ title, value: String(value) }))
          : [];

        // additional_info dönüşümü: [{ question, answer }] -> [{ title, content }]
        const additionalInfoArray = Array.isArray(product.additional_info)
          ? product.additional_info.map((item: any) => ({
              title: item.question || item.title || '',
              content: item.answer || item.content || '',
            }))
          : [];
        
        // images dönüşümü: string[] -> [{ url, alt }], ve eksik alt metni ekleme
        const imagesArray = Array.isArray(product.images)
          ? product.images.map((img: any, index: number) => {
              if (typeof img === 'string') {
                return { url: img, alt: `${product.name} - Resim ${index + 1}` };
              }
              return {
                url: img.url,
                alt: img.alt || `${product.name} - Resim ${index + 1}`,
              };
            }).filter((img: { url: string | null }) => img.url)
          : [];

        // Slug oluşturma
        const baseSlug = slugify(product.name.trim());
        let slug = baseSlug;
        let counter = 2;
        let slugExists = true;

        while (slugExists) {
          const { data: existingProduct, error: checkError } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

          if (checkError) {
            console.error(`Slug benzersizliği kontrol edilirken hata oluştu "${slug}":`, checkError.message);
            slug = `${baseSlug}-${Date.now()}`; // Fallback
            slugExists = false;
          } else if (!existingProduct) {
            slugExists = false;
          } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
        }

        // Ürün verilerini hazırla
        const productData = {
          slug,
          name: product.name.trim(),
          manufacturer: product.manufacturer.trim(),
          price: price.trim(),
          description: product.description?.trim() || '',
          features: Array.isArray(product.features) ? product.features : [],
          images: imagesArray,
          badge: product.badge?.trim() || null,
          status: ['active', 'inactive', 'draft'].includes(product.status) ? product.status : 'active',
          is_featured: Boolean(product.is_featured),
          rich_description: product.rich_description?.trim() || product.description?.trim() || null,
          technical_specs: technicalSpecsArray,
          additional_info: additionalInfoArray,
          pdf_document: product.pdf_document?.trim() || null,
          videos: Array.isArray(product.videos) ? product.videos : [],
          category_id: categoryId,
          seo_info: product.seo_info && typeof product.seo_info === 'object' ? product.seo_info : null,
          structured_data: product.structured_data && typeof product.structured_data === 'object' ? product.structured_data : null,
        };

        // Veritabanına ekle
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) {
          errors.push(`Ürün ${index + 1} (${product.name}): ${error.message}`);
        } else {
          results.push(data);
        }

      } catch (error) {
        errors.push(`Ürün ${index + 1} (${product.name}): İşlem hatası`);
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.length,
      errors: errors.length,
      products: results.map(p => ({ id: p.id, name: p.name })),
      error_details: errors
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Genel işlem hatası', details: error.message },
      { status: 500 }
    );
  }
}
