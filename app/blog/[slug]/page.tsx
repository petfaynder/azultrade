"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Heart, MessageCircle, Share2, ArrowLeft, Eye, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/database"
import { notFound } from "next/navigation"

// This component will fetch data on the client side.
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) return;
      try {
        const response = await fetch(`/api/blog/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        } else {
          setPost(null)
        }
      } catch (error) {
        console.error("Error fetching post:", error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  const handleLike = async () => {
    if (!post || liked) return

    try {
      // Note: Like functionality uses post.id, not slug.
      const response = await fetch(`/api/blog/${post.id}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setPost((prevPost) => prevPost ? { ...prevPost, likes: data.likes } : null)
        setLiked(true)
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!post) {
    // This will trigger the not-found.tsx file if it exists, or a default Next.js 404 page.
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-purple-600">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={1200}
                height={600}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-purple-600 text-white">{post.category}</Badge>
                  {post.featured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
                <p className="text-lg text-gray-200 leading-relaxed">{post.excerpt}</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Author and Meta Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{post.author}</div>
                    <div className="text-sm text-gray-600">{post.author_role}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.publish_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.read_time}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {post.views.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    disabled={liked}
                    className={liked ? "bg-pink-50 border-pink-200 text-pink-600" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                    {post.likes} {liked ? "Liked!" : "Like"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments} Comments
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* Author Bio Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-lg">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{post.author}</h3>
                  <p className="text-purple-600 font-medium mb-2">{post.author_role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
              <div className="text-center text-gray-500">
                <p>More related articles coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}