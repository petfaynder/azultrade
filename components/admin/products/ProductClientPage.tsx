"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Edit, Trash2, Search, Filter, X, Upload, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import TinyMCEEditor from "@/components/ui/tinymce-editor"
import type { Category, Product } from "@/lib/database"

interface ProductFormProps {
  formData: {
    name: string
    category_id: string
    manufacturer: string
    price: string
    rich_description: string
    technical_specs: { title: string; value: string }[]
    additional_info: { title: string; content: string }[]
    features: string[]
    images: { url: string; alt: string }[]
    videos: string[]
    pdf_document: string | null
    badge: string
    status: string
    is_featured: boolean
    seo_info: {
      primary_keyword?: string;
      long_tail_keywords?: string[];
      meta_description?: string;
      related_topics?: string[];
    } | null;
    structured_data: any | null;
  }
  setFormData: React.Dispatch<React.SetStateAction<ProductFormProps["formData"]>>
  addArrayField: (field: "features" | "images" | "videos" | "technical_specs" | "additional_info") => void
  removeArrayField: (field: "features" | "images" | "videos" | "technical_specs" | "additional_info", index: number) => void
  updateArrayField: (field: "features" | "videos", index: number, value: string) => void
  updateImageArrayField: (index: number, key: "url" | "alt", value: string) => void
  updateObjectArrayField: (
    field: "technical_specs" | "additional_info",
    index: number,
    key: "title" | "value" | "content",
    value: string,
  ) => void
  categories: Category[]
  handleAddProduct: () => Promise<void>
  handleEditProduct: () => Promise<void>
  resetForm: () => void
  isEdit?: boolean
  setIsAddDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setIsEditDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setEditingProduct?: React.Dispatch<React.SetStateAction<Product | null>>
  editingProduct?: Product | null
}

const ProductForm = ({
  formData,
  setFormData,
  addArrayField,
  removeArrayField,
  updateArrayField,
  updateImageArrayField,
  updateObjectArrayField,
  categories,
  handleAddProduct,
  handleEditProduct,
  resetForm,
  isEdit = false,
  setIsAddDialogOpen,
  setIsEditDialogOpen,
  setEditingProduct,
}: ProductFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="manufacturer">Manufacturer *</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            placeholder="Enter manufacturer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category_id">Category *</Label>
          <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Enter price or 'Contact for Price'"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rich_description">Rich Description</Label>
        <TinyMCEEditor
          value={formData.rich_description}
          onEditorChange={(content) => {
            setFormData({ ...formData, rich_description: content })
          }}
        />
      </div>

      {/* Features Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Features</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("features")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Feature
          </Button>
        </div>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateArrayField("features", index, e.target.value)}
                placeholder="Enter feature"
              />
              {formData.features.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeArrayField("features", index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Images Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Product Images</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("images")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>
        <div className="space-y-2">
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={image.url}
                onChange={(e) => updateImageArrayField(index, "url", e.target.value)}
                placeholder="Enter image URL"
                className="w-1/2"
              />
              <Input
                value={image.alt}
                onChange={(e) => updateImageArrayField(index, "alt", e.target.value)}
                placeholder="Enter alt text"
                className="w-1/2"
              />
              {formData.images.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeArrayField("images", index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Videos Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Product Videos</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("videos")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Video
          </Button>
        </div>
        <div className="space-y-2">
          {formData.videos.map((video, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={video}
                onChange={(e) => updateArrayField("videos", index, e.target.value)}
                placeholder="Enter YouTube URL or video link"
              />
              {formData.videos.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeArrayField("videos", index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Technical Specifications</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("technical_specs")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Spec
          </Button>
        </div>
        <div className="space-y-2">
          {formData.technical_specs.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={spec.title}
                onChange={(e) => updateObjectArrayField("technical_specs", index, "title", e.target.value)}
                placeholder="Spec Title (e.g., Weight)"
                className="w-1/2"
              />
              <Input
                value={spec.value}
                onChange={(e) => updateObjectArrayField("technical_specs", index, "value", e.target.value)}
                placeholder="Spec Value (e.g., 500 kg)"
                className="w-1/2"
              />
              {formData.technical_specs.length > 0 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeArrayField("technical_specs", index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Additional Information (e.g., FAQs)</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("additional_info")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Info
          </Button>
        </div>
        <div className="space-y-2">
          {formData.additional_info.map((info, index) => {
            console.log(`Additional Info Item ${index}:`, info); // DEBUG LOG
            return (
              <div key={index} className="space-y-2 border p-3 rounded-md">
                <Input
                  value={info.title}
                  onChange={(e) => updateObjectArrayField("additional_info", index, "title", e.target.value)}
                  placeholder="Info Title (e.g., FAQ Question)"
                />
                <Textarea
                  value={info.content}
                  onChange={(e) => updateObjectArrayField("additional_info", index, "content", e.target.value)}
                  placeholder="Info Content (Markdown supported)"
                  rows={3}
                />
                {formData.additional_info.length > 0 && (
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayField("additional_info", index)}>
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* SEO Information Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-semibold text-slate-800">SEO Information</h3>
        <div>
          <Label htmlFor="seo_primary_keyword">Primary Keyword</Label>
          <Input
            id="seo_primary_keyword"
            value={formData.seo_info?.primary_keyword || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seo_info: { ...prev.seo_info, primary_keyword: e.target.value },
              }))
            }
            placeholder="Enter primary keyword"
          />
        </div>
        <div>
          <Label htmlFor="seo_long_tail_keywords">Long-Tail Keywords (comma-separated)</Label>
          <Input
            id="seo_long_tail_keywords"
            value={formData.seo_info?.long_tail_keywords?.join(", ") || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seo_info: {
                  ...prev.seo_info,
                  long_tail_keywords: e.target.value.split(",").map((s) => s.trim()),
                },
              }))
            }
            placeholder="Enter long-tail keywords, comma-separated"
          />
        </div>
        <div>
          <Label htmlFor="seo_meta_description">Meta Description</Label>
          <Textarea
            id="seo_meta_description"
            value={formData.seo_info?.meta_description || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seo_info: { ...prev.seo_info, meta_description: e.target.value },
              }))
            }
            placeholder="Enter meta description"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="seo_related_topics">Related Topics (comma-separated)</Label>
          <Input
            id="seo_related_topics"
            value={formData.seo_info?.related_topics?.join(", ") || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seo_info: {
                  ...prev.seo_info,
                  related_topics: e.target.value.split(",").map((s) => s.trim()),
                },
              }))
            }
            placeholder="Enter related topics, comma-separated"
          />
        </div>
      </div>

      {/* Structured Data Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-semibold text-slate-800">Structured Data (JSON-LD)</h3>
        <div>
          <Label htmlFor="structured_data">Structured Data JSON</Label>
          <Textarea
            id="structured_data"
            value={JSON.stringify(formData.structured_data, null, 2) || ""}
            onChange={(e) => {
              try {
                setFormData((prev) => ({
                  ...prev,
                  structured_data: JSON.parse(e.target.value),
                }));
              } catch (error) {
                console.error("Invalid JSON for structured data:", error);
                // Optionally, show a toast error to the user
              }
            }}
            placeholder="Enter JSON-LD structured data"
            rows={10}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="badge">Badge (Optional)</Label>
          <Input
            id="badge"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="e.g., New, Featured, Best Seller"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Is Featured Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.is_featured}
          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <Label htmlFor="is_featured">Mark as Featured Product</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen && setIsEditDialogOpen(false)
              setEditingProduct && setEditingProduct(null)
            } else {
              setIsAddDialogOpen && setIsAddDialogOpen(false)
            }
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button type="button" onClick={isEdit ? handleEditProduct : handleAddProduct}>
          {isEdit ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </div>
  )
}

interface ProductClientPageProps {
    initialProducts: Product[];
    initialCategories: Category[];
}

export default function ProductClientPage({ initialProducts, initialCategories }: ProductClientPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  useEffect(() => {
    console.log("Initial Products:", initialProducts); // DEBUG LOG
    setProducts(initialProducts);
  }, [initialProducts]);
 
  const [selectedCategoryIdFilter, setSelectedCategoryIdFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  // Form states
  const [formData, setFormData] = useState<ProductFormProps["formData"]>({
    name: "",
    category_id: "",
    manufacturer: "",
    price: "",
    rich_description: "",
    technical_specs: [],
    additional_info: [],
    features: [""],
    images: [{ url: "", alt: "" }],
    videos: [""],
    pdf_document: null,
    badge: "",
    status: "active",
    is_featured: false,
    seo_info: null,
    structured_data: null,
  })

  const handleAddProduct = async () => {
    try {
      if (!formData.name || !formData.category_id || !formData.manufacturer) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Category, Manufacturer)",
          variant: "destructive",
        })
        return
      }

      const cleanedData: any = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ""),
        images: formData.images.filter((img) => img.url.trim() !== ""),
        videos: formData.videos.filter((video) => video.trim() !== ""),
        pdf_document: formData.pdf_document,
        rich_description: formData.rich_description,
        technical_specs: formData.technical_specs.filter((spec) => spec.title.trim() !== "" || spec.value.trim() !== ""),
        additional_info: formData.additional_info.filter((info) => info.title.trim() !== "" || info.content.trim() !== ""),
        is_featured: formData.is_featured,
        seo_info: formData.seo_info,
        structured_data: formData.structured_data,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create product")
      }

      // Ürün eklendikten sonra tüm ürün listesini yeniden çek
      const updatedProductsResponse = await fetch("/api/products");
      if (!updatedProductsResponse.ok) {
        throw new Error("Failed to re-fetch products after add");
      }
      const updatedProducts = await updatedProductsResponse.json();
      setProducts(updatedProducts);
      setIsAddDialogOpen(false);
      resetForm()

      toast({
        title: "Success",
        description: "Product added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    try {
      const cleanedData: any = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ""),
        images: formData.images.filter((img) => img.url.trim() !== ""),
        videos: formData.videos.filter((video) => video.trim() !== ""),
        pdf_document: formData.pdf_document,
        rich_description: formData.rich_description,
        technical_specs: formData.technical_specs.filter((spec) => spec.title.trim() !== "" || spec.value.trim() !== ""),
        additional_info: formData.additional_info.filter((info) => info.title.trim() !== "" || info.content.trim() !== ""),
        is_featured: formData.is_featured,
        seo_info: formData.seo_info,
        structured_data: formData.structured_data,
      }

      const response = await fetch(`/api/products/${editingProduct.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update product")
      }

      // Ürün güncellendikten sonra tüm ürün listesini yeniden çek
      const updatedProductsResponse = await fetch("/api/products");
      if (!updatedProductsResponse.ok) {
        throw new Error("Failed to re-fetch products after edit");
      }
      const updatedProducts = await updatedProductsResponse.json();
      setProducts(updatedProducts);
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      setEditingProduct(null)
      resetForm()

      toast({
        title: "Success",
        description: "Product updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }
 
      // Ürün silindikten sonra tüm ürün listesini yeniden çek
      const updatedProductsResponse = await fetch("/api/products");
      if (!updatedProductsResponse.ok) {
        throw new Error("Failed to re-fetch products after delete");
      }
      const updatedProducts = await updatedProductsResponse.json();
      setProducts(updatedProducts);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)

    console.log("Product additional_info from database:", product.additional_info); // DEBUG LOG

    // Technical specs'i array formatına çevir (object ise)
    let technicalSpecsArray: { title: string; value: string }[] = [];
    if (product.technical_specs) {
      if (Array.isArray(product.technical_specs)) {
        technicalSpecsArray = product.technical_specs;
      } else if (typeof product.technical_specs === 'object') {
        // Object ise array formatına çevir
        technicalSpecsArray = Object.entries(product.technical_specs).map(([title, value]) => ({
          title,
          value: String(value)
        }));
      }
    }

    // Additional info'yu array formatına çevir
    let additionalInfoArray: { title: string; content: string }[] = [];
    if (product.additional_info) {
      if (Array.isArray(product.additional_info)) {
        additionalInfoArray = product.additional_info;
      } else if (typeof product.additional_info === 'object') {
        // Object ise array formatına çevir
        additionalInfoArray = Object.entries(product.additional_info).map(([title, content]) => ({
          title,
          content: String(content)
        }));
      }
    }

    setFormData({
      name: product.name,
      category_id: product.category_id || "",
      manufacturer: product.manufacturer,
      price: product.price,
      rich_description: product.rich_description || "",
      technical_specs: technicalSpecsArray,
      additional_info: additionalInfoArray.length > 0 ? additionalInfoArray : [{ title: "", content: "" }],
      features: product.features.length > 0 ? product.features : [""],
      images: product.images.length > 0 ? product.images : [{ url: "", alt: "" }],
      videos: product.videos.length > 0 ? product.videos : [""],
      pdf_document: product.pdf_document || null,
      badge: product.badge || "",
      status: product.status,
      is_featured: product.is_featured || false,
      seo_info: product.seo_info || null,
      structured_data: product.structured_data || null,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: "",
      manufacturer: "",
      price: "",
      rich_description: "",
      technical_specs: [],
      additional_info: [],
      features: [""],
      images: [{ url: "", alt: "" }],
      videos: [""],
      pdf_document: null,
      badge: "",
      status: "active",
      is_featured: false,
      seo_info: null,
      structured_data: null,
    })
  }

  const addArrayField = (field: "features" | "images" | "videos" | "technical_specs" | "additional_info") => {
    setFormData((prev) => {
      if (field === "technical_specs") {
        return { ...prev, technical_specs: [...prev.technical_specs, { title: "", value: "" }] }
      }
      if (field === "additional_info") {
        return { ...prev, additional_info: [...prev.additional_info, { title: "", content: "" }] }
      }
      if (field === "images") {
        return { ...prev, images: [...prev.images, { url: "", alt: "" }] }
      }
      // @ts-ignore
      return { ...prev, [field]: [...prev[field], ""] }
    })
  }

  const removeArrayField = (field: "features" | "images" | "videos" | "technical_specs" | "additional_info", index: number) => {
    setFormData((prev) => {
      if (field === "technical_specs") {
        return { ...prev, technical_specs: prev.technical_specs.filter((_, i) => i !== index) }
      }
      if (field === "additional_info") {
        return { ...prev, additional_info: prev.additional_info.filter((_, i) => i !== index) }
      }
      if (field === "images") {
        return { ...prev, images: prev.images.filter((_, i) => i !== index) }
      }
      // @ts-ignore
      return { ...prev, [field]: (prev[field] as any).filter((_, i: number) => i !== index) }
    })
  }

  const updateArrayField = (field: "features" | "videos", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      // @ts-ignore
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const updateImageArrayField = (index: number, key: "url" | "alt", value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }))
  }

  const updateObjectArrayField = (
    field: "technical_specs" | "additional_info",
    index: number,
    key: "title" | "value" | "content",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }))
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategoryIdFilter === "all" || product.category_id === selectedCategoryIdFilter
    return matchesSearch && matchesCategory
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(filteredProducts.map((p) => p.id))
    } else {
      setSelectedProductIds([])
    }
  }

  const handleSelectProduct = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds((prev) => [...prev, id])
    } else {
      setSelectedProductIds((prev) => prev.filter((productId) => productId !== id))
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) return

    try {
      const response = await fetch("/api/admin/products/bulk-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", productIds: selectedProductIds }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete products")
      }

      const updatedProductsResponse = await fetch("/api/products")
      if (!updatedProductsResponse.ok) {
        throw new Error("Failed to re-fetch products after bulk delete")
      }
      const updatedProducts = await updatedProductsResponse.json()
      setProducts(updatedProducts)
      setSelectedProductIds([])

      toast({
        title: "Success",
        description: `${selectedProductIds.length} products deleted successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }
 
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-600 mt-2">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">Add New Product</DialogTitle>
                <DialogDescription>Fill in the details below to add a new product to the catalog.</DialogDescription>
              </DialogHeader>
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                addArrayField={addArrayField}
                removeArrayField={removeArrayField}
                updateArrayField={updateArrayField}
                updateImageArrayField={updateImageArrayField}
                updateObjectArrayField={updateObjectArrayField}
                categories={initialCategories}
                handleAddProduct={handleAddProduct}
                handleEditProduct={handleEditProduct}
                resetForm={resetForm}
                setIsAddDialogOpen={setIsAddDialogOpen}
              />
            </DialogContent>
          </Dialog>

        <Button
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
          onClick={() => window.location.href = '/admin/products/json-import'}
        >
          <Upload className="h-4 w-4 mr-2" />
          JSON Import
        </Button>
      </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Draft Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter((p) => p.status === "draft").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{products.reduce((sum, p) => sum + p.views, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={selectedCategoryIdFilter} onValueChange={setSelectedCategoryIdFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {initialCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProductIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
          <div className="text-sm font-medium text-slate-700">
            {selectedProductIds.length} product{selectedProductIds.length > 1 ? "s" : ""} selected
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} data-state={selectedProductIds.includes(product.id) && "selected"}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProductIds.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                      aria-label={`Select product ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        {product.images.length > 0 && (product.images[0] as any).url ? (
                          <img
                            src={(product.images[0] as any).url}
                            alt={(product.images[0] as any).alt || product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-slate-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{product.name}</div>
                        {product.badge && (
                          <Badge variant="secondary" className="mt-1">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{product.category_name}</TableCell>
                  <TableCell className="text-slate-600">{product.manufacturer}</TableCell>
                  <TableCell className="text-slate-900 font-medium">{product.price}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {product.images.length} img
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.videos.length} vid
                      </Badge>
                      {product.pdf_document && (
                        <Badge variant="outline" className="text-xs">
                          PDF
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active"
                          ? "default"
                          : product.status === "draft"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{product.views}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" title="View Product" className="hover:bg-blue-50">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit Product"
                        className="hover:bg-green-50"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete Product"
                        className="hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Edit Product: {editingProduct?.name}
            </DialogTitle>
            <DialogDescription>Update the details of the product below.</DialogDescription>
          </DialogHeader>
          <ProductForm
              formData={formData}
              setFormData={setFormData}
              addArrayField={addArrayField}
              removeArrayField={removeArrayField}
              updateArrayField={updateArrayField}
              updateImageArrayField={updateImageArrayField}
              updateObjectArrayField={updateObjectArrayField}
              categories={initialCategories}
              handleAddProduct={handleAddProduct}
              handleEditProduct={handleEditProduct}
              resetForm={resetForm}
              isEdit={true}
              setIsEditDialogOpen={setIsEditDialogOpen}
              setEditingProduct={setEditingProduct}
              editingProduct={editingProduct}
            />
          </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg">No products found</div>
          <p className="text-slate-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
