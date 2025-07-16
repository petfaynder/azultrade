"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  FileText,
  TrendingUp,
  BarChart3,
  Star,
  Heart,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
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
  status: "published" | "draft"
  publish_date: string
  created_at: string
}

const categories = [
  "All Categories",
  "Market Analysis",
  "Quality Control",
  "Logistics",
  "Sustainability",
  "Technology",
  "Industry News",
  "Export Tips",
]

export default function BlogAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    author_role: "Export Specialist",
    category: "Market Analysis",
    tags: "",
    image: "",
    featured: false,
    status: "published" as const,
  })

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    totalViews: 0,
    totalLikes: 0,
  })

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (selectedCategory !== "All Categories") {
        params.append("category", selectedCategory)
      }

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/blog?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)

        // Calculate stats
        const total = data.length
        const published = data.filter((p: BlogPost) => p.status === "published").length
        const draft = data.filter((p: BlogPost) => p.status === "draft").length
        const featured = data.filter((p: BlogPost) => p.featured).length
        const totalViews = data.reduce((sum: number, p: BlogPost) => sum + (p.views || 0), 0)
        const totalLikes = data.reduce((sum: number, p: BlogPost) => sum + (p.likes || 0), 0)

        setStats({ total, published, draft, featured, totalViews, totalLikes })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch blog posts",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, searchTerm])

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.author || !newPost.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const postData = {
        ...newPost,
        tags: newPost.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        image: newPost.image || "/placeholder.svg?height=400&width=600",
        publish_date: new Date().toISOString(),
      }

      console.log("Sending blog post data:", postData)

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const responseData = await response.json()
      console.log("API Response:", responseData)

      if (response.ok) {
        console.log("Blog post created:", responseData)

        setPosts((prev) => [responseData, ...prev])
        setIsAddDialogOpen(false)
        setNewPost({
          title: "",
          excerpt: "",
          content: "",
          author: "",
          author_role: "Export Specialist",
          category: "Market Analysis",
          tags: "",
          image: "",
          featured: false,
          status: "published" as const,
        })

        toast({
          title: "Success",
          description: "Blog post added successfully!",
        })

        // Refresh data to get updated stats
        fetchPosts()
      } else {
        console.error("API Error:", responseData)
        toast({
          title: "Error",
          description: responseData.error || "Failed to add blog post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding blog post:", error)
      toast({
        title: "Error",
        description: "Failed to add blog post",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return
    }

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
        toast({
          title: "Success",
          description: "Blog post deleted successfully!",
        })

        // Refresh data to get updated stats
        fetchPosts()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-600 text-lg mt-2">Manage your export industry insights and articles</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">Add New Blog Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                      Post Title *
                    </Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="e.g., Turkish Export Success in 2024"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
                      Category *
                    </Label>
                    <Select
                      value={newPost.category}
                      onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-sm font-semibold text-slate-700">
                    Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                    placeholder="Brief description of the post..."
                    rows={2}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-semibold text-slate-700">
                    Content *
                  </Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Full blog post content..."
                    rows={8}
                    className="mt-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="author" className="text-sm font-semibold text-slate-700">
                      Author *
                    </Label>
                    <Input
                      id="author"
                      value={newPost.author}
                      onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                      placeholder="e.g., Mehmet Özkan"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author_role" className="text-sm font-semibold text-slate-700">
                      Author Role
                    </Label>
                    <Input
                      id="author_role"
                      value={newPost.author_role}
                      onChange={(e) => setNewPost({ ...newPost, author_role: e.target.value })}
                      placeholder="e.g., Export Director"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm font-semibold text-slate-700">
                    Tags (comma separated)
                  </Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="exports, turkey, trade, success"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="image" className="text-sm font-semibold text-slate-700">
                    Featured Image URL
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      id="image"
                      value={newPost.image}
                      onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewPost({ ...newPost, image: "/placeholder.svg?height=400&width=600" })}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={newPost.featured}
                      onCheckedChange={(checked) => setNewPost({ ...newPost, featured: checked })}
                    />
                    <Label htmlFor="featured" className="text-sm font-semibold text-slate-700">
                      Featured Post
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm font-semibold text-slate-700">
                      Status
                    </Label>
                    <Select
                      value={newPost.status}
                      onValueChange={(value: "published" | "draft") => setNewPost({ ...newPost, status: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPost}
                    disabled={submitting}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {submitting ? "Adding..." : "Add Post"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Posts</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Published</p>
                <p className="text-3xl font-bold text-green-900">{stats.published}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Drafts</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Featured</p>
                <p className="text-3xl font-bold text-purple-900">{stats.featured}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Total Views</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">Total Likes</p>
                <p className="text-3xl font-bold text-pink-900">{stats.totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search posts by title, author, or content..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[220px] h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-12 px-6 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Blog Posts ({posts.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                        <span className="text-slate-500">Loading blog posts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <FileText className="h-12 w-12 text-slate-300" />
                        <div className="text-slate-500">
                          {searchTerm || selectedCategory !== "All Categories"
                            ? "No posts found matching your criteria"
                            : "No blog posts found. Add your first post!"}
                        </div>
                        {!searchTerm && selectedCategory === "All Categories" && (
                          <Button onClick={() => setIsAddDialogOpen(true)} className="mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Post
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              width={60}
                              height={60}
                              className="w-15 h-15 object-cover rounded-lg border"
                            />
                            {post.featured && (
                              <Badge className="absolute -top-2 -right-2 text-xs bg-yellow-500 text-white">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 line-clamp-1">{post.title}</div>
                            <div className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">{post.author}</div>
                          <div className="text-sm text-slate-500">{post.author_role}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={post.status === "published" ? "default" : "secondary"}
                          className={post.status === "published" ? "bg-green-100 text-green-800" : ""}
                        >
                          {post.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(post.publish_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" title="View Post" className="hover:bg-blue-50">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit Post" className="hover:bg-green-50">
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete Post"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
