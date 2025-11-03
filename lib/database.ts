import { supabase } from "./supabase"

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  order: number
  created_at: string
  updated_at: string
  product_count?: number // Kategoriye ait ürün sayısı
}

export interface SeoInfo {
  primary_keyword: string;
  long_tail_keywords: string[];
  meta_description: string;
  related_topics?: string[];
}

export interface ImageInfo {
  url: string;
  alt: string;
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string // Foreign key to categories table
  category_name?: string // Joined from categories table for display
  manufacturer: string
  price: string
  rich_description: string
  technical_specs: { title: string; value: string }[]
  additional_info: { title: string; content: string }[]
  features: string[]
  images: ImageInfo[]
  videos: string[]
  pdf_document?: string | null
  badge?: string
  status: string
  views: number
  created_at: string
  updated_at: string
  is_featured?: boolean
  seo_info?: SeoInfo;
  structured_data?: any; // Can be more specific if needed
  has_meta_description?: boolean;
  has_blog_content?: boolean;
  seo_score?: number;
  keyword_density?: number;
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // Changed to string to store HTML
  author: string
  author_role: string
  category: string
  tags: string[]
  image: string
  featured: boolean
  views: number
  likes: number
  comments: number
  status: string
  publish_date: string
  read_time: string
  created_at: string
  updated_at: string
  related_products?: { id: string; name: string; slug: string }[]; // New field for linking products
}

export interface Stats {
  total_products: number
  total_blog_posts: number
  total_views: number
  featured_posts: number
}

// Category functions
export async function getCategories(filters?: { sortBy?: string; sortOrder?: "asc" | "desc" }) {
  try {

    let query = supabase.from("categories").select("*")

    if (filters?.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === "asc" })
    } else {
      query = query.order("order", { ascending: true }).order("name", { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error in getCategories:", error)
      throw new Error(`Database error: ${error.message}`)
    }


    // Fetch product counts separately
    const { data: productCountsData, error: productCountsError } = await supabase.rpc("get_category_product_counts")

    if (productCountsError) {
      console.error("Database error in getCategories (fetching product counts):", productCountsError)
      throw new Error(`Database error: ${productCountsError.message}`)
    }

    const productCountsMap = new Map(productCountsData.map((item: any) => [item.category_id, item.product_count]))

    const processedData = data?.map((category: any) => ({
      ...category,
      product_count: productCountsMap.get(category.id) || 0,
    })) || []

    return processedData as Category[]
  } catch (error) {
    console.error("Error in getCategories:", error)
    throw error
  }
}

export async function getCategory(id: string) {
  try {

    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) {
      console.error("Database error in getCategory:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as Category
  } catch (error) {
    console.error("Error in getCategory:", error)
    throw error
  }
}

export async function createCategory(category: Omit<Category, "id" | "created_at" | "updated_at">) {
  try {

    const { data, error } = await supabase.from("categories").insert([category]).select().single()

    if (error) {
      console.error("Database error in createCategory:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as Category
  } catch (error) {
    console.error("Error in createCategory:", error)
    throw error
  }
}

export async function updateCategory(id: string, category: Partial<Category>) {
  try {

    const { data, error } = await supabase.from("categories").update(category).eq("id", id).select().single()

    if (error) {
      console.error("Database error in updateCategory:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as Category
  } catch (error) {
    console.error("Error in updateCategory:", error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  try {

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("Database error in deleteCategory:", error)
      throw new Error(`Database error: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in deleteCategory:", error)
    throw error
  }
}

// Product functions
export async function getProducts(filters?: { category?: string; search?: string; is_featured?: boolean; limit?: number; sortBy?: string; sortOrder?: string; include_seo?: boolean; }) {
  try {

    let query = supabase
      .from("products")
      .select("id, name, slug, category_id, manufacturer, price, rich_description, technical_specs, additional_info, features, images, videos, pdf_document, badge, status, views, created_at, updated_at, is_featured, seo_info, structured_data, categories(name)")
    
    // Sorting logic
    if (filters?.sortBy && filters?.sortOrder) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (filters?.category) {
      query = query.eq("category_id", filters.category)
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,manufacturer.ilike.%${filters.search}%,rich_description.ilike.%${filters.search}%`,
      )
    }

    if (filters?.is_featured) {
      query = query.eq("is_featured", true)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error in getProducts:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    // Fetch all blog posts to check for related products
    const { data: blogPostsData, error: blogPostsError } = await supabase
      .from("blog_posts")
      .select("id, related_products");

    if (blogPostsError) {
      console.error("Database error in getProducts (fetching blog posts):", blogPostsError);
      throw new Error(`Database error: ${blogPostsError.message}`);
    }

    const productBlogPostCounts = new Map<string, number>();
    blogPostsData?.forEach(post => {
      post.related_products?.forEach((product: { id: string }) => {
        productBlogPostCounts.set(product.id, (productBlogPostCounts.get(product.id) || 0) + 1);
      });
    });

    // Process data
    let processedData = data?.map((product: any) => ({
      ...product,
      category_name: product.categories?.name || "Uncategorized",
      images: product.images || [],
      videos: product.videos || [],
      features: product.features || [],
      technical_specs: product.technical_specs || [],
      additional_info: product.additional_info || [],
      seo_info: product.seo_info || null,
      structured_data: product.structured_data || null,
    })) || [];

    if (filters?.include_seo) {
      processedData = processedData.map((product: any) => {
        const blogPostCount = productBlogPostCounts.get(product.id) || 0;
        const richDescription = product.rich_description || "";
        const words = richDescription.split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const primaryKeyword = product.seo_info?.primary_keyword || product.name;
        const keywordCount = (richDescription.match(new RegExp(primaryKeyword, "gi")) || []).length;
        const keywordDensity = wordCount > 0 ? parseFloat(((keywordCount / wordCount) * 100).toFixed(2)) : 0;

        let seoScore = 0;
        if (product.seo_info?.meta_description && product.seo_info.meta_description.trim().length > 0) {
          seoScore += 20;
        }

        if (blogPostCount >= 3) {
          seoScore += 30;
        } else if (blogPostCount > 0) {
          seoScore += 20;
        }

        if (keywordDensity >= 1.5 && keywordDensity <= 2.5) {
          seoScore += 30;
        }

        if (product.views > 100) {
          seoScore += 10;
        }

        const imagesWithAltText = (product.images || []).every((img: ImageInfo) => img.alt && img.alt.trim().length > 0);
        if (imagesWithAltText) {
          seoScore += 10;
        }

        return {
          ...product,
          has_meta_description: !!product.seo_info?.meta_description && product.seo_info.meta_description.trim().length > 0,
          has_blog_content: blogPostCount > 0,
          seo_score: seoScore,
          keyword_density: keywordDensity,
        };
      });
    }

    return processedData as Product[]
  } catch (error) {
    console.error("Error in getProducts:", error)
    throw error
  }
}

export async function getProduct(id: string) {
  try {

    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, category_id, manufacturer, price, rich_description, technical_specs, additional_info, features, images, videos, pdf_document, badge, status, views, created_at, updated_at, is_featured, seo_info, structured_data, categories(name)")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      console.error("Database error in getProduct:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!data) {
      return null;
    }

    // Ensure arrays are properly initialized and map category name
    const processedData: Product = {
      ...data,
      category_name: (data as any).categories?.name || "Uncategorized", // Map joined category name
      images: data.images || [],
      videos: data.videos || [],
      features: data.features || [],
      technical_specs: data.technical_specs || [],
      additional_info: data.additional_info || [],
      seo_info: data.seo_info || null,
      structured_data: data.structured_data || null,
    } as Product

    return processedData
  } catch (error) {
    console.error("Error in getProduct:", error)
    throw error
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, category_id, manufacturer, price, rich_description, technical_specs, additional_info, features, images, videos, pdf_document, badge, status, views, created_at, updated_at, is_featured, seo_info, structured_data, categories(name)")
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error("Database error in getProductBySlug:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!data) {
      return null;
    }
    
    const processedData: Product = {
      ...data,
      category_name: (data as any).categories?.name || "Uncategorized",
      images: data.images || [],
      videos: data.videos || [],
      features: data.features || [],
      technical_specs: data.technical_specs || [],
      additional_info: data.additional_info || [],
      seo_info: data.seo_info || null,
      structured_data: data.structured_data || null,
    } as Product

    return processedData
  } catch (error) {
    console.error("Error in getProductBySlug:", error)
    throw error
  }
}

export async function createProduct(product: Omit<Product, "id" | "views" | "created_at" | "updated_at" | "category_name">) {
  try {

    console.log("Database: Creating product with data:", product)

    // Ensure arrays are properly formatted and clean up empty strings
    const cleanedProduct = {
      ...product,
      images: (product.images || []).filter((img) => img.url && img.url.trim() !== ""),
      videos: (product.videos || []).filter((video) => video && video.trim() !== ""),
      features: (product.features || []).filter((feature) => feature && feature.trim() !== ""),
      pdf_document: product.pdf_document?.trim() || null,
      rich_description: product.rich_description || "",
      technical_specs: product.technical_specs || [],
      additional_info: product.additional_info || [],
      views: 0,
      seo_info: product.seo_info || null,
      structured_data: product.structured_data || null,
    }

    const { data, error } = await supabase.from("products").insert([cleanedProduct]).select().single()

    if (error) {
      console.error("Database error in createProduct:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("Database: Product created successfully:", data)
    return data as Product
  } catch (error) {
    console.error("Error in createProduct:", error)
    throw error
  }
}

export async function updateProduct(id: string, product: Partial<Omit<Product, "category_name">>) {
  try {

    // Clean up arrays if they exist in the update
    const cleanedProduct = { ...product }
    if (cleanedProduct.images) {
      cleanedProduct.images = cleanedProduct.images.filter((img) => img.url && img.url.trim() !== "")
    }
    if (cleanedProduct.videos) {
      cleanedProduct.videos = cleanedProduct.videos.filter((video) => video && video.trim() !== "")
    }
    if (cleanedProduct.features) {
      cleanedProduct.features = cleanedProduct.features.filter((feature) => feature && feature.trim() !== "")
    }
    if (cleanedProduct.pdf_document !== undefined) {
      cleanedProduct.pdf_document = cleanedProduct.pdf_document === "" ? null : cleanedProduct.pdf_document?.trim() || null
    }
    if (cleanedProduct.technical_specs) {
      cleanedProduct.technical_specs = cleanedProduct.technical_specs.filter((spec) => spec.title && spec.value)
    }
    if (cleanedProduct.additional_info) {
      cleanedProduct.additional_info = cleanedProduct.additional_info.filter((info) => info.title && info.content)
    }

    const { data, error } = await supabase.from("products").update(cleanedProduct).eq("id", id).select().single()

    if (error) {
      console.error("Database error in updateProduct:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as Product
  } catch (error) {
    console.error("Error in updateProduct:", error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Database error in deleteProduct:", error)
      throw new Error(`Database error: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in deleteProduct:", error)
    throw error
  }
}

export async function incrementProductViews(id: string) {
  try {

    const { error } = await supabase.rpc("increment_product_views", {
      product_id: id,
    })

    if (error) {
      console.error("Database error in incrementProductViews:", error)
      throw new Error(`Database error: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in incrementProductViews:", error)
    throw error
  }
}

// Blog functions
export async function getBlogPosts(filters?: { category?: string; search?: string; limit?: number; excludeId?: string }) {
  try {

    let query = supabase.from("blog_posts").select("*").order("publish_date", { ascending: false })
 
    if (filters?.category && filters.category !== "All Categories") {
      query = query.eq("category", filters.category)
    }
 
    if (filters?.excludeId) {
      query = query.neq("id", filters.excludeId)
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
      )
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error in getBlogPosts:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as BlogPost[]
  } catch (error) {
    console.error("Error in getBlogPosts:", error)
    throw error
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {

    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Database error in getBlogPostBySlug:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as BlogPost
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error)
    throw error
  }
}

export async function getBlogPostById(id: string) {
  try {

    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

    if (error) {
      console.error("Database error in getBlogPostById:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as BlogPost
  } catch (error) {
    console.error("Error in getBlogPostById:", error)
    throw error
  }
}

export async function createBlogPost(
  post: Omit<BlogPost, "id" | "views" | "likes" | "comments" | "created_at" | "updated_at">,
) {
  try {

    console.log("Database: Creating blog post with data:", post)

    // Ensure status is set and related_products is properly formatted
    const postData = {
      ...post,
      status: post.status || "published",
      views: 0,
      likes: 0,
      comments: 0,
      related_products: post.related_products || [],
    }

    console.log("Database: Final blog post data:", postData)

    const { data, error } = await supabase.from("blog_posts").insert([postData]).select().single()

    if (error) {
      console.error("Database error in createBlogPost:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("Database: Blog post created successfully:", data)
    return data as BlogPost
  } catch (error) {
    console.error("Error in createBlogPost:", error)
    throw error
  }
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  try {
    // Ensure related_products is properly formatted if it exists in the update
    const cleanedPost = { ...post };
    if (cleanedPost.related_products) {
      cleanedPost.related_products = cleanedPost.related_products.filter(
        (product) => product.id && product.name && product.slug
      );
    }

    const { data, error } = await supabase.from("blog_posts").update(cleanedPost).eq("id", id).select().single()

    if (error) {
      console.error("Database error in updateBlogPost:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as BlogPost
  } catch (error) {
    console.error("Error in updateBlogPost:", error)
    throw error
  }
}

export async function deleteBlogPost(id: string) {
  try {

    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      console.error("Database error in deleteBlogPost:", error)
      throw new Error(`Database error: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in deleteBlogPost:", error)
    throw error
  }
}

export async function incrementBlogViews(id: string) {
  try {

    const { error } = await supabase.rpc("increment_blog_views", {
      post_id: id,
    })

    if (error) {
      console.error("Database error in incrementBlogViews:", error)
      throw new Error(`Database error: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in incrementBlogViews:", error)
    throw error
  }
}

export async function incrementBlogLikes(id: string) {
  try {

    const { error } = await supabase.rpc("increment_blog_likes", {
      post_id: id,
    })

    if (error) {
      console.error("Database error in incrementBlogLikes:", error)
      throw new Error(`Database error: ${error.message}`)
    }
  } catch (error) {
    console.error("Error in incrementBlogLikes:", error)
    throw error
  }
}

// Stats function
export async function getStats() {
  try {

    const { data, error } = await supabase.rpc("get_stats")

    if (error) {
      console.error("Database error in getStats:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as Stats
  } catch (error) {
    console.error("Error in getStats:", error)
    throw error
  }
}

// Messages functions
export interface Message {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message_content: string;
  status: "Yeni" | "Okundu" | "Cevaplandı" | "Arşivlendi";
  created_at: string;
  updated_at: string;
  ip_address?: string;
}

export async function getMessages(filters: {
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Message[]; count: number }> {
  try {
    // --- DEBUGGING LINES START ---

    const { data: { user } } = await supabase.auth.getUser();
    const { status, sortBy = 'created_at', sortOrder = 'desc', search, page = 1, limit = 10 } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
 
     let query = supabase
       .from('messages')
       .select('*', { count: 'exact' })
       .order(sortBy, { ascending: sortOrder === 'asc' })
       .range(from, to);

    if (status && status !== 'Tümü') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,subject.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Database error in getMessages:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: data as Message[], count: count || 0 };
  } catch (error) {
    console.error("Error in getMessages:", error);
    throw error;
  }
}

export async function getMessageById(id: string): Promise<Message | null> {
  try {
    // First, fetch the message

    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return null; // Not found
      console.error("Database error in getMessageById (fetch):", fetchError);
      throw new Error(`Database error: ${fetchError.message}`);
    }

    // If the message status is 'Yeni', update it to 'Okundu'
    if (message.status === 'Yeni') {
      const { data: updatedMessage, error: updateError } = await supabase
        .from('messages')
        .update({ status: 'Okundu' })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        console.error("Database error in getMessageById (update):", updateError);
        // Don't throw, just return the original message
        return message as Message;
      }
      return updatedMessage as Message;
    }

    return message as Message;
  } catch (error) {
    console.error("Error in getMessageById:", error);
    throw error;
  }
}

export async function getQuotesAdmin() {
  try {

    const { data, error } = await supabase
      .from('quotes')
      .select(`
        id,
        customer_name,
        customer_email,
        company_name,
        phone_number,
        message,
        status,
        created_at,
        quote_items (
          quantity,
          notes,
          products (
            id,
            name,
            manufacturer
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error in getQuotesAdmin:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getQuotesAdmin:', error);
    throw error;
  }
}
