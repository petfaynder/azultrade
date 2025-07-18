"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Mail, Phone, User, Clock, Hash, Trash2, Archive, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getMessageById, Message } from "@/lib/database"

export default function MessageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string

  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchMessage = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getMessageById(id)
        if (!data) {
          throw new Error("Message not found")
        }
        setMessage(data)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "Error",
          description: "Could not fetch message.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchMessage()
  }, [id, toast])

  const handleStatusChange = async (newStatus: Message["status"]) => {
    if (!message) return
    try {
      const response = await fetch(`/api/admin/messages/${message.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error(`Failed to update status to ${newStatus}`)
      const updatedMessage = await response.json()
      setMessage(updatedMessage.data)
      toast({ description: `Message marked as ${newStatus}.` })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update message status.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!message) return
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch("/api/admin/messages", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [message.id] }),
        })
        if (!response.ok) throw new Error("Failed to delete message")
        toast({ description: "Message deleted." })
        router.push("/admin/messages")
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not delete message.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return <MessageDetailSkeleton />
  }

  if (error || !message) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || "Message not found."}</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => router.back()} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inbox
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{message.subject}</CardTitle>
            <Badge>{message.status}</Badge>
          </div>
          <CardDescription>
            From: {`${message.full_name} <${message.email}>`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{message.message_content}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" /> <span>{message.full_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> <span>{message.email}</span>
            </div>
            {message.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> <span>{message.phone_number}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> <span>{new Date(message.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" /> <span>IP: {message.ip_address}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <a href={`mailto:${message.email}?subject=RE: ${message.subject}`}>
          <Button>
            <Mail className="mr-2 h-4 w-4" /> Reply
          </Button>
        </a>
        <Button onClick={() => handleStatusChange("Cevaplandı")} variant="outline">
          <CheckCircle className="mr-2 h-4 w-4" /> Mark as Replied
        </Button>
        <Button onClick={() => handleStatusChange("Arşivlendi")} variant="outline">
          <Archive className="mr-2 h-4 w-4" /> Archive
        </Button>
        <Button onClick={handleDelete} variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  )
}

function MessageDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}