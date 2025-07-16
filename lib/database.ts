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

export interface Product {
  id: string
  name: string
  category_id: string // Foreign key to categories table
  category_name?: string // Joined from categories table for display
  manufacturer: string
  price: string
  rich_description: string
  technical_specs: { title: string; value: string }[]
  additional_info: { title: string; content: string }[]
  features: string[]
  images: string[]
  videos: string[]
  pdf_document?: string | null
  badge?: string
  status: string
  views: number
  created_at: string
  updated_at: string
  is_featured?: boolean
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
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
  read_time: string // Yeni eklendi
  created_at: string
  updated_at: string
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

    if (error) {
      console.error("Database error in getCategories (fetching categories):", error)
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
export async function getProducts(filters?: { category?: string; search?: string; is_featured?: boolean; limit?: number }) {
  try {
    let query = supabase
      .from("products")
      .select("*, categories(name)") // Join with categories table to get category name
      .order("created_at", { ascending: false })

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

    // Ensure arrays are properly initialized and map category name
    const processedData =
      data?.map((product: any) => ({
        ...product,
        category_name: product.categories?.name || "Uncategorized", // Map joined category name
        images: product.images || [],
        videos: product.videos || [],
        features: product.features || [],
        technical_specs: product.technical_specs || [],
        additional_info: product.additional_info || [],
      })) || []

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
      .select("*, categories(name)") // Join with categories table to get category name
      .eq("id", id)
      .single()

    if (error) {
      console.error("Database error in getProduct:", error)
      throw new Error(`Database error: ${error.message}`)
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
    } as Product

    return processedData
  } catch (error) {
    console.error("Error in getProduct:", error)
    throw error
  }
}

export async function createProduct(product: Omit<Product, "id" | "views" | "created_at" | "updated_at" | "category_name">) {
  try {
    console.log("Database: Creating product with data:", product)

    // Ensure arrays are properly formatted and clean up empty strings
    const cleanedProduct = {
      ...product,
      images: (product.images || []).filter((img) => img && img.trim() !== ""),
      videos: (product.videos || []).filter((video) => video && video.trim() !== ""),
      features: (product.features || []).filter((feature) => feature && feature.trim() !== ""),
      pdf_document: product.pdf_document?.trim() || null,
      rich_description: product.rich_description || "",
      technical_specs: product.technical_specs || [],
      additional_info: product.additional_info || [],
      views: 0,
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
      cleanedProduct.images = cleanedProduct.images.filter((img) => img && img.trim() !== "")
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
export async function getBlogPosts(filters?: { category?: string; search?: string; limit?: number }) {
  try {
    let query = supabase.from("blog_posts").select("*").order("publish_date", { ascending: false })

    if (filters?.category && filters.category !== "All Categories") {
      query = query.eq("category", filters.category)
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

export async function getBlogPost(id: string) {
  try {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

    if (error) {
      console.error("Database error in getBlogPost:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data as BlogPost
  } catch (error) {
    console.error("Error in getBlogPost:", error)
    throw error
  }
}

export async function createBlogPost(
  post: Omit<BlogPost, "id" | "views" | "likes" | "comments" | "created_at" | "updated_at">,
) {
  try {
    console.log("Database: Creating blog post with data:", post)

    // Ensure status is set
    const postData = {
      ...post,
      status: post.status || "published",
      views: 0,
      likes: 0,
      comments: 0,
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
    const { data, error } = await supabase.from("blog_posts").update(post).eq("id", id).select().single()

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
