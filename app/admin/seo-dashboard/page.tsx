'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  Target, TrendingUp, FileText, CheckCircle, Clock, AlertCircle,
  ArrowLeft, Lightbulb, BarChart3, Users, Link2, Zap
} from 'lucide-react';

interface SEOProduct {
  id: string;
  name: string;
  category_name: string;
  status: string;
  views: number;
  seo_score: number;
  keyword_density: number;
  has_meta_description?: boolean;
  has_blog_content?: boolean;
}

interface SEOTask {
  id: string;
  product_id: string;
  product_slug: string;
  product_name: string;
  task: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  completed_at?: string;
  notes?: string;
}

export default function SEODashboardPage() {
  const [products, setProducts] = useState<SEOProduct[]>([]);
  const [tasks, setTasks] = useState<SEOTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedBlogType, setSelectedBlogType] = useState<string>('');
  const [blogPrompt, setBlogPrompt] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState<string>('');
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [productsPerPage] = useState(5); // Number of products per page
  const [currentPageTasks, setCurrentPageTasks] = useState(1);
  const [tasksPerPage] = useState(5); // Number of tasks per page
  const [dynamicSeoSuggestions, setDynamicSeoSuggestions] = useState<string[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    fetchSEOData();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      if (product) {
        setDynamicSeoSuggestions(generateDynamicSeoSuggestions(product));
      }
    } else {
      setDynamicSeoSuggestions([]);
    }
  }, [selectedProductId, products]);

  const fetchSEOData = async () => {
    try {
      setLoading(true);

      // Generate tasks before fetching
      await fetch('/api/admin/seo-tasks/generate', { method: 'POST' });

      // Fetch products with SEO metrics
      const productsResponse = await fetch('/api/products?include_seo=true');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } else {
        toast({
          title: "Hata",
          description: "Ürünler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }

      // Fetch SEO tasks
      const tasksResponse = await fetch('/api/admin/seo-tasks');
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } else {
        toast({
          title: "Hata",
          description: "SEO görevleri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('SEO data fetch error:', error);
      toast({
        title: "Hata",
        description: "Veri çekilirken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      const response = await fetch(`/api/admin/seo-tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await fetchSEOData(); // Refresh data
        toast({
          title: "Başarılı",
          description: "Görev durumu güncellendi.",
        });
      } else {
        toast({
          title: "Hata",
          description: "Görev durumu güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Task update error:', error);
      toast({
        title: "Hata",
        description: "Görev durumu güncellenirken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const generateBlogPromptContent = (product: SEOProduct, type: string) => {
    const productUrl = `${window.location.origin}/products/${(product as any).slug || product.id}`;
    let prompt = `Create an SEO-optimized blog post for this product:

PRODUCT: ${product.name}
PRODUCT URL: ${productUrl}
CATEGORY: ${product.category_name}
TARGET KEYWORDS: ${product.name.toLowerCase()}, ${product.category_name.toLowerCase()}, ${type.replace('-', ' ').toLowerCase()}

REQUIREMENTS:
1. 1500-2000 words in English
2. Include keywords naturally (1.5-2% density)
3. Use H1, H2, H3 structure with keywords
4. Include FAQ section with long-tail keywords
5. Add internal linking suggestions
6. Include call-to-action sections

TARGET AUDIENCE: Farmers, agricultural professionals, livestock managers

IMPORTANT: Create original, compelling content that provides real value to readers. Focus on practical information and industry insights.

INTERNAL LINKING: When suggesting internal links, use the base URL of the site: ${window.location.origin}. For example, if linking to a product, use a format like: [Product Name](${window.location.origin}/products/product-slug). If linking to a blog post, use: [Blog Post Title](${window.location.origin}/blog/blog-slug).

IMAGE PLACEMENT: For inline images within the 'content' array, use placeholder URLs like "https://via.placeholder.com/800x400?text=Image+Description". The user will manually replace these placeholder URLs with actual uploaded image URLs after generation.

GENERATE IN JSON FORMAT: The output MUST be a valid JSON object following the structure provided below. Do NOT include any additional text or markdown outside the JSON.

JSON FORMAT:
\`\`\`json
{
  "title": "SEO-Optimized Title of the Blog Post",
  "slug": "seo-optimized-slug-for-the-blog-post",
  "excerpt": "A concise summary of the blog post, optimized for search engines.",
  "content": [
    {
      "type": "heading",
      "level": 2,
      "text": "Introduction: Main Keyword in First Paragraph"
    },
    {
      "type": "paragraph",
      "text": "Start with an engaging introduction, naturally incorporating the main keyword. Provide a brief overview of the topic and what the reader will learn."
    },
    {
      "type": "heading",
      "level": 3,
      "text": "Section 1: Detailed Topic Discussion"
    },
    {
      "type": "paragraph",
      "text": "Elaborate on the first key aspect. Use supporting keywords and provide valuable information. Break down complex ideas into easily digestible paragraphs."
    },
    {
      "type": "list",
      "style": "unordered",
      "items": [
        "Key benefit 1",
        "Key feature 2",
        "Important consideration 3"
      ]
    },
    {
      "type": "image",
      "url": "https://example.com/image-url.jpg",
      "alt": "Descriptive alt text for the image"
    },
    {
      "type": "heading",
      "level": 3,
      "text": "Section 2: Another Aspect or Solution"
    },
    {
      "type": "paragraph",
      "text": "Continue with another important point. Ensure smooth transitions between sections. Maintain keyword density naturally."
    },
    {
      "type": "quote",
      "text": "An impactful quote related to the topic.",
      "author": "Quote Author"
    },
    {
      "type": "heading",
      "level": 2,
      "text": "FAQ Section"
    },
    {
      "type": "faq",
      "questions": [
        {
          "question": "What is [long-tail keyword 1]?",
          "answer": "Detailed answer to the question."
        },
        {
          "question": "How does [long-tail keyword 2] work?",
          "answer": "Detailed answer to the question."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": "Conclusion and Call to Action"
    },
    {
      "type": "paragraph",
      "text": "Summarize the main points and provide a clear call to action (e.g., 'Contact us for more information', 'Explore our products')."
    }
  ],
  "author": "AI Assistant",
  "author_role": "Content Creator",
  "category": "${product.category_name}",
  "tags": ["${product.name.toLowerCase().replace(/\\s/g, '-')}", "${product.category_name.toLowerCase().replace(/\\s/g, '-')}", "${type.replace('-', ' ').toLowerCase().replace(/\\s/g, '-')}"],
  "image": "https://example.com/featured-image.jpg",
  "featured": false,
  "status": "draft",
  "publish_date": "YYYY-MM-DD",
  "read_time": "X min read",
  "related_products": [
    {
      "id": "${product.id}",
      "name": "${product.name}",
      "slug": "${(product as any).slug || product.id}"
    }
  ]
}
\`\`\``;

    switch (type) {
      case 'product-guide':
        // The JSON format already includes a generic structure for product guides.
        // No additional structure needed here, as the AI should follow the JSON schema.
        break;
      case 'comparison':
        // The JSON format already includes a generic structure.
        // The AI should adapt the content within the JSON structure.
        break;
      case 'maintenance':
        // The JSON format already includes a generic structure.
        // The AI should adapt the content within the JSON structure.
        break;
      default:
        break;
    }
    return prompt;
  };

  const generateDynamicSeoSuggestions = (product: SEOProduct): string[] => {
    const suggestions: string[] = [];

    if (product.seo_score < 60) {
      suggestions.push(`• Ürünün SEO skorunu artırmak için anahtar kelime yoğunluğunu (${product.keyword_density}%) iyileştirin.`);
    }
    if (!product.has_meta_description) {
      suggestions.push(`• "${product.name}" için benzersiz ve çekici bir meta açıklama ekleyin.`);
    }
    if (!product.has_blog_content) {
      suggestions.push(`• "${product.name}" ile ilgili blog içeriği oluşturarak otoriteyi artırın.`);
    }
    if (product.views < 100) { // Arbitrary low view count for suggestion
      suggestions.push(`• Ürün tanıtımını artırmak için sosyal medya ve diğer kanallarda paylaşım yapın.`);
    }
    if (product.keyword_density < 1.5) {
      suggestions.push(`• Anahtar kelime yoğunluğunu %1.5 - %2 arasına çıkarmak için içeriği gözden geçirin.`);
    }

    if (suggestions.length === 0) {
      suggestions.push("• Bu ürün için mevcut durumda özel bir SEO önerisi bulunmamaktadır. Performansı yüksek!");
    }

    return suggestions;
  };

  const handleGenerateBlogPrompt = () => {
    if (!selectedProductId || !selectedBlogType) {
      toast({
        title: "Uyarı",
        description: "Lütfen bir ürün ve blog yazısı türü seçin.",
      });
      return;
    }
    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      const prompt = generateBlogPromptContent(product, selectedBlogType);
      setBlogPrompt(prompt);
      navigator.clipboard.writeText(prompt);
      toast({
        title: "Başarılı",
        description: "Blog yazısı prompt'u oluşturuldu ve panoya kopyalandı.",
      });
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalProducts = products.length;
  const optimizedProducts = products.filter(p => p.seo_score >= 60).length;
  const avgSEOScore = products.length > 0
    ? Math.round(products.reduce((sum, p) => sum + p.seo_score, 0) / products.length)
    : 0;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.category_name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Pagination logic for products
  const indexOfLastProduct = currentPageProducts * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Pagination logic for tasks
  const indexOfLastTask = currentPageTasks * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalTaskPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/admin/products'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SEO Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Ürünlerinizin SEO performansını takip edin ve optimize edin
          </p>
        </div>
      </div>

      <Toaster />

      {/* SEO Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Toplam Ürün
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Target className="h-4 w-4" />
              SEO Optimize
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{optimizedProducts}</div>
            <Progress value={totalProducts > 0 ? (optimizedProducts / totalProducts) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ortalama SEO Skoru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSEOScoreColor(avgSEOScore)}`}>
              {avgSEOScore}%
            </div>
            <Progress value={avgSEOScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tamamlanan Görevler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
            <p className="text-xs text-gray-500 mt-1">
              {tasks.length} toplam görevden
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Ürün SEO Analizi</TabsTrigger>
          <TabsTrigger value="tasks">SEO Görevleri</TabsTrigger>
          <TabsTrigger value="blog">Blog İçerik Üretimi</TabsTrigger>
        </TabsList>

        {/* Products SEO Analysis */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ürün SEO Performansı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  className="w-full p-2 border rounded-md"
                  value={productSearchTerm}
                  onChange={(e) => {
                    setCurrentPageProducts(1);
                    setProductSearchTerm(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-4">
                {currentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{product.name}</h3>
                        <Badge variant="outline">{product.category_name}</Badge>
                        <Badge className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {product.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Görüntülenme: {product.views}</span>
                        <span>SEO Skoru: <span className={getSEOScoreColor(product.seo_score)}>{product.seo_score}%</span></span>
                        <span>Keyword Density: {product.keyword_density}%</span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Badge variant={product.has_meta_description ? "default" : "destructive"} className="text-xs">
                          {product.has_meta_description ? "Meta Description ✓" : "Meta Description ✗"}
                        </Badge>
                        <Badge variant={product.has_blog_content ? "default" : "secondary"} className="text-xs">
                          {product.has_blog_content ? "Blog Content ✓" : "Blog Content ✗"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBlogPrompt(generateBlogPromptContent(product, 'product-guide'));
                          navigator.clipboard.writeText(generateBlogPromptContent(product, 'product-guide'));
                          setSelectedProductId(product.id);
                          setSelectedBlogType('product-guide');
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Blog Yazısı
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/products/${(product as any).slug || product.id}`, '_blank')}
                      >
                        Ürünü Görüntüle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPageProducts(prev => Math.max(1, prev - 1))}
                  disabled={currentPageProducts === 1}
                >
                  Önceki
                </Button>
                <span className="self-center text-sm text-gray-700">
                  Sayfa {currentPageProducts} / {totalProductPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPageProducts(prev => Math.min(totalProductPages, prev + 1))}
                  disabled={currentPageProducts === totalProductPages}
                >
                  Sonraki
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tasks */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                SEO Görev Takibi
              </CardTitle>
              <Button onClick={fetchSEOData} size="sm" variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Görevleri Yenile ve Üret
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        className="mt-1"
                        checked={task.status === 'completed'}
                        onCheckedChange={(checked) => {
                          updateTaskStatus(task.id, checked ? 'completed' : 'pending');
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">{task.task}</h4>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          <a
                            href={`/products/${task.product_slug}`}
                            className="hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {task.product_name}
                          </a>
                        </p>
                        {task.notes && (
                          <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-md">{task.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'in_progress' ? 'secondary' : 'outline'
                          }
                        >
                          {task.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {task.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                          {task.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {task.status === 'completed' ? 'Tamamlandı' :
                           task.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          disabled={task.status === 'completed'}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <span>Bitiş: {task.due_date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPageTasks(prev => Math.max(1, prev - 1))}
                  disabled={currentPageTasks === 1}
                >
                  Önceki
                </Button>
                <span className="self-center text-sm text-gray-700">
                  Sayfa {currentPageTasks} / {totalTaskPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPageTasks(prev => Math.min(totalTaskPages, prev + 1))}
                  disabled={currentPageTasks === totalTaskPages}
                >
                  Sonraki
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Content Generation */}
        <TabsContent value="blog" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Blog Yazısı Üretimi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="product-select" className="block text-sm font-medium mb-2">Ürün Seçin:</label>
                  <select
                    id="product-select"
                    className="w-full p-2 border rounded-md"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value="">Ürün seçin...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Blog Yazısı Türü:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="blogType"
                        value="product-guide"
                        checked={selectedBlogType === 'product-guide'}
                        onChange={(e) => setSelectedBlogType(e.target.value)}
                      />
                      <span className="text-sm">Ürün Rehberi</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="blogType"
                        value="comparison"
                        checked={selectedBlogType === 'comparison'}
                        onChange={(e) => setSelectedBlogType(e.target.value)}
                      />
                      <span className="text-sm">Karşılaştırma</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="blogType"
                        value="maintenance"
                        checked={selectedBlogType === 'maintenance'}
                        onChange={(e) => setSelectedBlogType(e.target.value)}
                      />
                      <span className="text-sm">Bakım Rehberi</span>
                    </label>
                  </div>
                </div>

                <Button className="w-full" variant="outline" onClick={handleGenerateBlogPrompt}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Blog Yazısı Prompt'u Üret
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  SEO Önerileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProductId ? (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Ürüne Özel Öneriler</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {dynamicSeoSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-600">
                    <p>Ürüne özel SEO önerilerini görmek için yukarıdan bir ürün seçin.</p>
                  </div>
                )}

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Genel İçerik Stratejisi</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Blog yazıları: Minimum 3 adet</li>
                    <li>• İçerik uzunluğu: 1500-2000 kelime</li>
                    <li>• Keyword density: %1.5-2</li>
                    <li>• Internal links: 5+ adet</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Teknik SEO İpuçları</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Schema markup ekleme</li>
                    <li>• Meta description optimizasyonu</li>
                    <li>• Heading structure (H1, H2, H3)</li>
                    <li>• Image alt text ekleme</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Blog Prompt */}
          {blogPrompt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Üretilen Blog Yazısı Prompt'u
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Textarea
                      value={blogPrompt}
                      readOnly
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(blogPrompt);
                        toast({
                          title: "Başarılı",
                          description: "Prompt panoya kopyalandı.",
                        });
                      }}
                      className="flex-1"
                    >
                      📋 Prompt'u Kopyala
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBlogPrompt('');
                        toast({
                          title: "Başarılı",
                          description: "Prompt temizlendi.",
                        });
                      }}
                    >
                      Temizle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
