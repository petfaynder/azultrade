'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, Save, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/database'; // Assuming Product interface is exported from lib/database

// Define the expected JSON structure for a blog post
interface BlogPostJson {
  title: string;
  slug: string;
  excerpt: string;
  content: Array<{
    type: string;
    level?: number;
    text?: string;
    url?: string;
    alt?: string;
    style?: string;
    items?: string[];
    questions?: Array<{ question: string; answer: string }>;
    author?: string;
  }>;
  author: string;
  author_role: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  status: string;
  publish_date: string;
  read_time: string;
  related_products?: { id: string; name: string; slug: string }[];
}

// Utility function to convert JSON content blocks to HTML
const jsonContentToHtml = (contentBlocks: BlogPostJson['content']): string => {
  let html = '';
  contentBlocks.forEach(block => {
    switch (block.type) {
      case 'heading':
        html += `<h${block.level || 2}>${block.text || ''}</h${block.level || 2}>`;
        break;
      case 'paragraph':
        html += `<p>${block.text || ''}</p>`;
        break;
      case 'list':
        if (block.items && Array.isArray(block.items)) {
          html += `<ul>`; // Always use ul for simplicity, styling can handle appearance
          block.items.forEach(item => {
            html += `<li>${item}</li>`;
          });
          html += `</ul>`;
        }
        break;
      case 'image':
        if (block.url) {
          // Add styling for better presentation
          html += `<figure class="my-4"><img src="${block.url}" alt="${block.alt || ''}" class="rounded-lg shadow-md mx-auto" /><figcaption class="text-center text-sm text-gray-500 mt-2">${block.alt || ''}</figcaption></figure>`;
        }
        break;
      case 'quote':
        if (block.text) {
          html += `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4"><p>${block.text}</p>${block.author ? `<cite class="block text-right not-italic">- ${block.author}</cite>` : ''}</blockquote>`;
        }
        break;
      case 'faq':
        if (block.questions && Array.isArray(block.questions)) {
          html += `<div class="faq-section my-4">`;
          block.questions.forEach(faq => {
            html += `<h4 class="font-semibold">${faq.question || ''}</h4><p class="mb-2">${faq.answer || ''}</p>`;
          });
          html += `</div>`;
        }
        break;
      default:
        if (block.text) {
          html += `<p>${block.text}</p>`;
        }
        break;
    }
  });
  return html;
};

export default function JsonBlogCreatePage() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast({
          title: "Hata",
          description: "Ürünler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Hata",
        description: "Ürünler çekilirken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const validateJson = (json: string): BlogPostJson | null => {
    try {
      const parsed: BlogPostJson = JSON.parse(json);

      // Basic validation for required fields
      if (!parsed.title || !parsed.slug || !parsed.excerpt || !parsed.content || !parsed.author || !parsed.category || !parsed.tags || !parsed.image || !parsed.status || !parsed.publish_date || !parsed.read_time) {
        setValidationError('JSON eksik veya hatalı alanlar içeriyor: title, slug, excerpt, content, author, category, tags, image, status, publish_date, read_time alanları zorunludur.');
        return null;
      }

      if (!Array.isArray(parsed.content) || parsed.content.length === 0) {
        setValidationError('Content alanı boş olamaz ve bir dizi olmalıdır.');
        return null;
      }

      // Validate content blocks (basic check)
      for (const block of parsed.content) {
        if (!block.type) {
          setValidationError('Content blokları "type" alanı içermelidir.');
          return null;
        }
      }

      // Validate related_products if present
      if (parsed.related_products && !Array.isArray(parsed.related_products)) {
        setValidationError('related_products alanı bir dizi olmalıdır.');
        return null;
      }
      if (parsed.related_products) {
        for (const rp of parsed.related_products) {
          if (!rp.id || !rp.name || !rp.slug) {
            setValidationError('related_products içindeki her ürün id, name ve slug içermelidir.');
            return null;
          }
        }
      }

      setValidationError('');
      return parsed;
    } catch (e: any) {
      setValidationError(`Geçersiz JSON formatı: ${e.message}`);
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const validatedData = validateJson(jsonInput);

    if (!validatedData) {
      setLoading(false);
      toast({
        title: "Hata",
        description: validationError,
        variant: "destructive",
      });
      return;
    } // Added missing closing brace here

    try {
      // Convert JSON content array to HTML string
      const htmlContent = jsonContentToHtml(validatedData.content);

      const payload = {
        ...validatedData,
        content: htmlContent, // Replace content array with HTML string
      };

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Blog yazısı başarıyla oluşturuldu.",
        });
        router.push('/admin/blog'); // Redirect to blog list
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: `Blog yazısı oluşturulurken bir hata oluştu: ${errorData.error || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to create blog post:', error);
      toast({
        title: "Hata",
        description: "Blog yazısı oluşturulurken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Toaster />
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/blog')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">JSON ile Blog Yazısı Oluştur</h1>
          <p className="text-slate-600 mt-2">
            Yapay zeka tarafından üretilen veya manuel olarak hazırlanan JSON formatındaki blog yazılarını buraya yapıştırın.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Yazısı JSON İçeriği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="json-input">JSON İçeriği</Label>
            <Textarea
              id="json-input"
              placeholder='Blog yazısı JSON içeriğini buraya yapıştırın. Örnek format için aşağıdaki "JSON Formatı" kartına bakın.'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
            {validationError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <XCircle className="h-4 w-4" /> {validationError}
              </p>
            )}
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Oluşturuluyor...' : 'Blog Yazısını Oluştur'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beklenen JSON Formatı</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
            {`{
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
  "category": "Product Guides",
  "tags": ["keyword1", "keyword2", "long-tail-keyword"],
  "image": "https://example.com/featured-image.jpg",
  "featured": false,
  "status": "draft",
  "publish_date": "YYYY-MM-DD",
  "read_time": "X min read",
  "related_products": [
    {
      "id": "product-id-1",
      "name": "Product Name 1",
      "slug": "product-slug-1"
    },
    {
      "id": "product-id-2",
      "name": "Product Name 2",
      "slug": "product-slug-2"
    }
  ]
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
