"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Trash2, ChevronDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { getMessages, Message } from "@/lib/database"

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page") || "1", 10),
    totalPages: 1,
  })
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "Tümü")

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, count } = await getMessages({
        page: pagination.page,
        limit: 10,
        status: statusFilter,
        search: searchTerm,
        sortBy: "created_at",
        sortOrder: "desc",
      })
      setMessages(data || [])
      setPagination(prev => ({ ...prev, totalPages: Math.ceil(count / 10) }))
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Could not fetch messages.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("page", pagination.page.toString())
    newParams.set("status", statusFilter)
    newParams.set("search", searchTerm)
    // Update URL without re-triggering a full navigation
    router.replace(`?${newParams.toString()}`, { scroll: false })
    fetchMessages()
  }, [pagination.page, statusFilter, searchTerm])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(messages.map((m) => m.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    try {
      const response = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      })
      if (!response.ok) throw new Error("Failed to delete messages")
      toast({ description: `${selectedIds.length} message(s) deleted.` })
      setSelectedIds([])
      fetchMessages()
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete messages.",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const statusBadgeVariant = (status: Message["status"]) => {
    switch (status) {
      case "Yeni":
        return "default"
      case "Okundu":
        return "secondary"
      case "Cevaplandı":
        return "outline"
      case "Arşivlendi":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <p className="text-sm text-muted-foreground">Manage all incoming messages.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Status: {statusFilter} <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["Tümü", "Yeni", "Okundu", "Cevaplandı", "Arşivlendi"].map((status) => (
              <DropdownMenuItem key={status} onSelect={() => setStatusFilter(status)}>
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleBulkDelete} disabled={selectedIds.length === 0} variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete ({selectedIds.length})
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.length > 0 && selectedIds.length === messages.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="h-12 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow
                  key={message.id}
                  className={cn("cursor-pointer", message.status === "Yeni" && "font-bold bg-blue-50/50")}
                  onClick={() => router.push(`/admin/messages/${message.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(message.id)}
                      onCheckedChange={(checked) => handleSelectRow(message.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(message.status)}>{message.status}</Badge>
                  </TableCell>
                  <TableCell>{message.full_name}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell className="text-right">
                    {new Date(message.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(pagination.page - 1)
              }}
              aria-disabled={pagination.page <= 1}
              className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(i + 1)
                }}
                isActive={pagination.page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(pagination.page + 1)
              }}
              aria-disabled={pagination.page >= pagination.totalPages}
              className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}