"use client"

import { useState, useEffect, memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, RefreshCw, FileText, TrendingUp, BarChart3, Star, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import TinyMCEEditor from "@/components/ui/tinymce-editor"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  author_role: string
  category: string
  tags: string[] | string
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
  "All Categories", "Market Analysis", "Quality Assurance", "Logistics", "Branding", "Supplier Management", "Finance", "Technical Support"
]

export default function BlogAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null)
  const [newPost, setNewPost] = useState({
    title: "", excerpt: "", content: "", author: "", author_role: "Export Specialist", category: "Market Analysis",
    tags: "", image: "", featured: false, status: "published" as const
  })

  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, featured: 0, totalViews: 0, totalLikes: 0 })

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "All Categories") params.append("category", selectedCategory)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/blog?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
        const total = data.length
        const published = data.filter((p: BlogPost) => p.status === "published").length
        const draft = data.filter((p: BlogPost) => p.status === "draft").length
        const featured = data.filter((p: BlogPost) => p.featured).length
        const totalViews = data.reduce((sum: number, p: BlogPost) => sum + (p.views || 0), 0)
        const totalLikes = data.reduce((sum: number, p: BlogPost) => sum + (p.likes || 0), 0)
        setStats({ total, published, draft, featured, totalViews, totalLikes })
      } else {
        toast({ title: "Error", description: "Failed to fetch blog posts", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({ title: "Error", description: "Failed to fetch blog posts", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, searchTerm])

  const handleOpenEditDialog = (post: BlogPost) => {
    setEditingPost({ ...post, tags: Array.isArray(post.tags) ? post.tags.join(", ") : "" });
    setIsEditDialogOpen(true);
  };

  const handleFormSubmit = async (isEditing: boolean) => {
    const postData = isEditing ? editingPost : newPost;

    if (!postData?.title || !postData.content || !postData.author || !postData.category) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    setSubmitting(true)
    const apiEndpoint = isEditing ? `/api/admin/blog/${editingPost?.id}` : "/api/blog"
    const method = isEditing ? "PUT" : "POST"

    const payload = {
      ...postData,
      tags: typeof postData.tags === 'string' ? postData.tags.split(",").map(t => t.trim()).filter(t => t) : [],
      image: postData.image || "/placeholder.svg?height=400&width=600",
      publish_date: isEditing ? (postData as BlogPost).publish_date : new Date().toISOString(),
    }

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      if (response.ok) {
        toast({ title: "Success", description: `Blog post ${isEditing ? 'updated' : 'added'} successfully!` })
        if (isEditing) setIsEditDialogOpen(false); else setIsAddDialogOpen(false);
        fetchPosts() // Refresh the list
      } else {
        toast({ title: "Error", description: responseData.error || `Failed to ${isEditing ? 'update' : 'add'} blog post`, variant: "destructive" })
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} blog post:`, error)
      toast({ title: "Error", description: `Failed to ${isEditing ? 'update' : 'add'} blog post`, variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Blog post deleted successfully!" })
        fetchPosts()
      } else {
        toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" })
    }
  }

const BlogForm = memo(({ postState, setPostState, categories }: { postState: any, setPostState: Function, categories: string[] }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="title">Post Title *</Label>
        <Input id="title" value={postState.title} onChange={(e) => setPostState((prevState: any) => ({ ...prevState, title: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select value={postState.category} onValueChange={(value) => setPostState((prevState: any) => ({ ...prevState, category: value }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{categories.slice(1).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
    <div>
      <Label htmlFor="excerpt">Excerpt</Label>
      <Textarea id="excerpt" value={postState.excerpt} onChange={(e) => setPostState((prevState: any) => ({ ...prevState, excerpt: e.target.value }))} rows={2} />
    </div>
    <div>
      <Label htmlFor="content">Content *</Label>
      <TinyMCEEditor
        value={postState.content}
        onEditorChange={(content) => {
          setPostState((prevState: any) => ({ ...prevState, content: content }))
        }}
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="author">Author *</Label>
        <Input id="author" value={postState.author} onChange={(e) => setPostState((prevState: any) => ({ ...prevState, author: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="author_role">Author Role</Label>
        <Input id="author_role" value={postState.author_role} onChange={(e) => setPostState((prevState: any) => ({ ...prevState, author_role: e.target.value }))} />
      </div>
    </div>
    <div>
      <Label htmlFor="tags">Tags (comma separated)</Label>
      <Input id="tags" value={postState.tags} onChange={(e) => setPostState((prevState: any) => ({ ...prevState, tags: e.target.value }))} />
    </div>
    <div>
      <Label htmlFor="image">Featured Image URL</Label>
      <Input id="image" value={postState.image} onChange={(e) => setPostState((prevState: any) => ({ ...prevState, image: e.target.value }))} />
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Switch id="featured" checked={postState.featured} onCheckedChange={(c) => setPostState((prevState: any) => ({ ...prevState, featured: c }))} />
        <Label htmlFor="featured">Featured Post</Label>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={postState.status} onValueChange={(v: "published" | "draft") => setPostState((prevState: any) => ({ ...prevState, status: v }))}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
));

  const handleSetNewPost = useCallback((newState: any) => {
    setNewPost(newState);
  }, []);

  const handleSetEditingPost = useCallback((newState: any) => {
    setEditingPost(newState);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-600 text-lg mt-2">Manage your export industry insights and articles</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchPosts} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /><span>Refresh</span></Button>
          <Link href="/admin/blog/json-create">
            <Button variant="outline" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <Upload className="mr-2 h-4 w-4" />JSON Import
            </Button>
          </Link>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-to-r from-blue-600 to-blue-700"><Plus className="mr-2 h-4 w-4" />Add Post</Button></DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Blog Post</DialogTitle>
                <DialogDescription>Create a new blog post by filling out the form below.</DialogDescription>
              </DialogHeader>
              <BlogForm postState={newPost} setPostState={handleSetNewPost} categories={categories} />
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => handleFormSubmit(false)} disabled={submitting}>{submitting ? "Adding..." : "Add Post"}</Button>
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

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input placeholder="Search posts..." className="pl-10 h-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[220px] h-12"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader><CardTitle>Blog Posts ({posts.length} items)</CardTitle></CardHeader>
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
                  <TableRow><TableCell colSpan={8} className="text-center py-12">Loading...</TableCell></TableRow>
                ) : posts.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12">No posts found.</TableCell></TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Image src={post.image || "/placeholder.svg"} alt={post.title} width={60} height={60} className="w-15 h-15 object-cover rounded-lg border" />
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
                      <TableCell><Badge variant="outline">{post.category}</Badge></TableCell>
                      <TableCell><Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge></TableCell>
                      <TableCell>{post.views || 0}</TableCell>
                      <TableCell>{post.likes || 0}</TableCell>
                      <TableCell>{new Date(post.publish_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" title="View Post"><Eye className="h-4 w-4 text-blue-600" /></Button>
                          </Link>
                          <Button variant="ghost" size="sm" title="Edit Post" onClick={() => handleOpenEditDialog(post)}><Edit className="h-4 w-4 text-green-600" /></Button>
                          <Button variant="ghost" size="sm" title="Delete Post" onClick={() => handleDeletePost(post.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>Update the details of your blog post here.</DialogDescription>
          </DialogHeader>
          {editingPost && <BlogForm postState={editingPost} setPostState={handleSetEditingPost} categories={categories} />}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => handleFormSubmit(true)} disabled={submitting}>{submitting ? "Updating..." : "Update Post"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
