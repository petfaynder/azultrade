"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search, Upload } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { updateCategory } from "@/lib/database" // Import updateCategory
import type { Category } from "@/lib/database"
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "@hello-pangea/dnd" // Using @hello-pangea/dnd for Next.js 13+ compatibility

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/categories?sortBy=order&sortOrder=asc")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    try {
      if (!formData.name) {
        toast({
          title: "Validation Error",
          description: "Category name is required",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create category")
      }

      const newCategory = await response.json()
      setCategories([...categories, newCategory])
      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add category",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory) return

    try {
      if (!formData.name) {
        toast({
          title: "Validation Error",
          description: "Category name is required",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update category")
      }

      const updatedCategory = await response.json()
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? updatedCategory : cat)))
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      resetForm()
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      setCategories(categories.filter((cat) => cat.id !== id))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      order: category.order,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      order: 0,
    })
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const reorderedCategories = Array.from(categories)
    const [movedCategory] = reorderedCategories.splice(result.source.index, 1)
    reorderedCategories.splice(result.destination.index, 0, movedCategory)

    setCategories(reorderedCategories)

    // Update order in database
    try {
      for (let i = 0; i < reorderedCategories.length; i++) {
        const category = reorderedCategories[i]
        if (category.order !== i) {
          await updateCategory(category.id, { order: i })
        }
      }
      toast({
        title: "Success",
        description: "Category order updated successfully",
      })
    } catch (error) {
      console.error("Error updating category order:", error)
      toast({
        title: "Error",
        description: "Failed to update category order",
        variant: "destructive",
      })
      // Revert to original order if update fails
      fetchCategories()
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading categories...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-600 mt-2">Manage your product categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleAddCategory}
              resetForm={resetForm}
              setIsDialogOpen={setIsAddDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Order</TableHead><TableHead>Category Name</TableHead><TableHead>Slug</TableHead><TableHead>Description</TableHead><TableHead>Image</TableHead><TableHead>Ürün Sayısı</TableHead>{/* Yeni sütun başlığı */}<TableHead>Actions</TableHead></TableRow>
            </TableHeader>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="categories">
                {(provided: DroppableProvided) => (
                  <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredCategories.map((category, index) => (
                      <Draggable key={category.id} draggableId={category.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          ><TableCell className="font-medium">{category.order}</TableCell><TableCell className="font-medium">{category.name}</TableCell><TableCell className="text-slate-600">{category.slug}</TableCell><TableCell className="text-slate-600">{category.description || "-"}</TableCell><TableCell>{category.image ? (<img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded-md" />) : ("-")}</TableCell><TableCell>{/* Yeni Ürün Sayısı sütunu */}<Link href={`/products?category=${category.id}`} className="text-blue-600 hover:underline">{category.product_count || 0}</Link></TableCell><TableCell><div className="flex items-center gap-2"><Button variant="ghost" size="sm" title="Edit Category" className="hover:bg-green-50" onClick={() => openEditDialog(category)}><Edit className="h-4 w-4 text-green-600" /></Button><Button variant="ghost" size="sm" title="Delete Category" className="hover:bg-red-50" onClick={() => handleDeleteCategory(category.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></div></TableCell></TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Edit Category: {editingCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleEditCategory}
            resetForm={resetForm}
            setIsDialogOpen={setIsEditDialogOpen}
            isEdit={true}
            editingCategory={editingCategory}
          />
        </DialogContent>
      </Dialog>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg">No categories found</div>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria or add a new category.</p>
        </div>
      )}
    </div>
  )
}

interface CategoryFormProps {
  formData: {
    name: string
    slug: string
    description: string
    image: string
    order: number
  }
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormProps["formData"]>>
  handleSubmit: () => Promise<void>
  resetForm: () => void
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  isEdit?: boolean
  editingCategory?: Category | null
}

const CategoryForm = ({ formData, setFormData, handleSubmit, resetForm, setIsDialogOpen, isEdit = false }: CategoryFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name"
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="Auto-generated from name"
          disabled
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter category description"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="Enter image URL"
          />
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          placeholder="Enter display order"
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsDialogOpen(false)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          {isEdit ? "Update Category" : "Add Category"}
        </Button>
      </div>
    </div>
  )
}