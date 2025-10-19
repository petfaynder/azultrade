import type { MetadataRoute } from "next"
import { getProducts, getBlogPosts } from "@/lib/database"
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://azulglobaltrade.com"
 
  // Get all products
  const products = await getProducts()
  const productUrls = products.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    priority: 0.8,
  }))
 
  // Get all blog posts
  const blogPosts = await getBlogPosts()
  const blogUrls = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    priority: 0.7,
  }))
 
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]
 
  return [...staticUrls, ...productUrls, ...blogUrls]
}
