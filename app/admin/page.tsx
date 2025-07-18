"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, FileText, Users, Eye, MessageCircle, Plus, BarChart3, TrendingUp, TrendingDown, Clock, Zap } from "lucide-react"
import { getProducts, getBlogPosts, getCategories, Stats, Product, BlogPost, Category } from "@/lib/database"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Helper function to format large numbers
const formatNumber = (num: number | undefined | null) => {
  if (typeof num !== "number") {
    return "0"
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [productsData, postsData, categoriesData] = await Promise.all([
          getProducts(),
          getBlogPosts(),
          getCategories(),
        ])

        setAllProducts(productsData)
        setAllPosts(postsData)
        setAllCategories(categoriesData)

        const totalProducts = productsData.length
        const totalBlogPosts = postsData.length
        const totalViews = 
          productsData.reduce((sum, p) => sum + p.views, 0) + 
          postsData.reduce((sum, p) => sum + p.views, 0)
        const featuredPosts = postsData.filter(p => p.featured).length

        setStats({
          total_products: totalProducts,
          total_blog_posts: totalBlogPosts,
          total_views: totalViews,
          featured_posts: featuredPosts,
        })

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: "Total Products",
      value: stats?.total_products,
      icon: Package,
    },
    {
      title: "Blog Posts",
      value: stats?.total_blog_posts,
      icon: FileText,
    },
    {
      title: "Total Views",
      value: stats?.total_views,
      icon: Eye,
    },
    {
      title: "Featured Posts",
      value: stats?.featured_posts,
      icon: Users,
    },
  ]

  // Process data for cards
  const mostViewedProducts = [...allProducts].sort((a, b) => b.views - a.views).slice(0, 5)
  const leastViewedProducts = [...allProducts].sort((a, b) => a.views - b.views).slice(0, 5)
  const mostReadPosts = [...allPosts].sort((a, b) => b.views - a.views).slice(0, 5)
  
  const productActivity = allProducts.map(p => ({ ...p, type: 'product' as const, activityDate: new Date(p.updated_at) }))
  const postActivity = allPosts.map(p => ({ ...p, type: 'post' as const, activityDate: new Date(p.updated_at) }))
  const recentActivity = [...productActivity, ...postActivity].sort((a, b) => b.activityDate.getTime() - a.activityDate.getTime()).slice(0, 5)

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const staleContent = [
    ...allProducts.map(p => ({ ...p, type: 'product' as const })), 
    ...allPosts.map(p => ({ ...p, type: 'post' as const }))
  ].filter(item => new Date(item.updated_at) < sixMonthsAgo)

  const categoryProductCounts = allCategories.map(category => ({
    name: category.name,
    value: allProducts.filter(p => p.category_id === category.id).length
  })).filter(c => c.value > 0)

  const topCategories = [...categoryProductCounts].sort((a, b) => b.value - a.value).slice(0, 5)
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-80 mt-2" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your export business.</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/products">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(stat.value)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            {/* Most Viewed Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Most Viewed Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mostViewedProducts.map((product) => (
                    <Tooltip key={product.id}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between text-sm">
                          <Link href={`/products/${product.id}`} className="hover:underline flex-1 min-w-0" target="_blank">
                            <p className="truncate">{product.name}</p>
                          </Link>
                          <div className="flex items-center text-gray-500 pl-2">
                            <Eye className="h-4 w-4 mr-1" />
                            {formatNumber(product.views)}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{product.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Least Viewed Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                  Least Viewed Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leastViewedProducts.map((product) => (
                    <Tooltip key={product.id}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between text-sm">
                          <Link href={`/products/${product.id}`} className="hover:underline flex-1 min-w-0" target="_blank">
                            <p className="truncate">{product.name}</p>
                          </Link>
                          <div className="flex items-center text-gray-500 pl-2">
                            <Eye className="h-4 w-4 mr-1" />
                            {formatNumber(product.views)}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{product.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {/* Most Read Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Most Read Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mostReadPosts.map((post) => (
                    <Tooltip key={post.id}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between text-sm">
                          <Link href={`/blog/${post.slug}`} className="hover:underline flex-1 min-w-0" target="_blank">
                            <p className="truncate">{post.title}</p>
                          </Link>
                          <div className="flex items-center text-gray-500 pl-2">
                            <Eye className="h-4 w-4 mr-1" />
                            {formatNumber(post.views)}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{post.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <Tooltip key={`${item.type}-${item.id}`}>
                      <TooltipTrigger asChild>
                        <div className="flex items-start text-sm">
                          <div className="w-10 flex-shrink-0">
                            {item.type === 'product' ? 
                              <Package className="h-5 w-5 text-gray-400" /> : 
                              <FileText className="h-5 w-5 text-gray-400" />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="truncate font-medium">
                              {item.type === 'product' ? (item as Product).name : (item as BlogPost).title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.type === 'product' ? 'Product' : 'Blog Post'} updated {new Date(item.activityDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.type === 'product' ? (item as Product).name : (item as BlogPost).title}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Content to Review */}
            {staleContent.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Content to Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    These items haven't been updated in over 6 months.
                  </p>
                  <div className="space-y-3">
                    {staleContent.slice(0, 5).map((item) => (
                      <Tooltip key={`${item.id}-stale`}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between text-sm">
                            <p className="truncate font-medium">
                              {('name' in item) ? item.name : item.title}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'product' ? 'Product' : 'Blog'}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{('name' in item) ? item.name : item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Category Distribution Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryProductCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryProductCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Categories List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <p className="font-medium">{category.name}</p>
                    </div>
                    <p className="text-gray-600">{category.value} products</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/products">
                <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent">
                  <Package className="h-6 w-6" />
                  <span>Add Product</span>
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent">
                  <FileText className="h-6 w-6" />
                  <span>Write Post</span>
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent" disabled>
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </Link>
              <Link href="/admin/messages">
                <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent" disabled>
                  <MessageCircle className="h-6 w-6" />
                  <span>Messages</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
