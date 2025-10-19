'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface ImportResult {
  success: boolean;
  imported: number;
  errors: number;
  products?: Array<{ id: string; name: string }>;
  error_details?: string[];
}

export default function JSONImportPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonInput(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonInput(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      alert('Lütfen JSON verisi girin');
      return;
    }

    setIsImporting(true);
    try {
      let jsonData;
      try {
        jsonData = JSON.parse(jsonInput);
      } catch (error) {
        alert('Geçersiz JSON formatı');
        return;
      }

      const response = await fetch('/api/admin/import-json-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });

      const result = await response.json();

      if (response.ok) {
        setResult(result);
        if (result.success) {
          setJsonInput(''); // Başarılı olursa temizle
        }
      } else {
        alert('Import hatası: ' + result.error);
      }

    } catch (error: any) {
      alert('Import hatası: ' + error.message);
    }
    setIsImporting(false);
  };

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
          <h1 className="text-3xl font-bold text-slate-900">JSON ile Ürün Import</h1>
          <p className="text-slate-600 mt-2">
            ChatGPT'den aldığınız JSON verilerini yükleyin ve ürünlerinizi otomatik olarak ekleyin. `slug` alanı ürün adından otomatik olarak oluşturulacaktır.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            JSON Veri Yükleme
          </h3>

          {/* Prompt Generators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Tekli Link */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">🔗 Tek Ürün Linki</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-green-700">Tek Ürün Linki:</label>
                  <Input
                    placeholder="https://example.com/product/123"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const link = e.target.value;
                      if (link) {
                        const prompt = `Analyze this product page and create SEO-optimized content in English JSON format:

${link}

SEO REQUIREMENTS:
- Primary keyword: Extract from product category (e.g., "feed mixers", "industrial equipment")
- Long-tail keywords: Create 5-7 relevant long-tail keywords
- Meta description: 150-160 characters with primary keyword
- Content structure: H1, H2, H3 with keywords
- Keyword density: 1.5-2% for main keywords

IMPORTANT: Only extract information that ACTUALLY EXISTS on the page. Do NOT invent, assume, or estimate any features, specifications, or details that are not explicitly stated on the product page.

Translate all content to English and create SEO-optimized, compelling product descriptions with different wording than the original. Focus on search engine optimization while maintaining factual accuracy.

Return ONLY the following JSON format (no other text):
{
  "products": [{
    "name": "Product name in English",
    "manufacturer": "Manufacturer name in English",
    "price": "Contact for Price",
    "description": "Short, compelling English description (150-160 characters).",
    "rich_description": "Create a detailed, SEO-optimized product description in HTML format. Use H2 and H3 tags for headings, bullet points (ul/li) for key features, and bold text (strong) for important terms. The description should be comprehensive, engaging, and structured for readability.",
    "features": ["Feature 1", "Feature 2"],
    "images": [
        { "url": "image1.jpg", "alt": "Descriptive alt text for image 1" },
        { "url": "image2.jpg", "alt": "Descriptive alt text for image 2" }
    ],
    "badge": "Professional",
    "status": "active",
    "is_featured": false,
    "technical_specs": {
      "Key": "Value format, extracting ALL technical specs"
    },
    "additional_info": [
        { "question": "Relevant FAQ 1?", "answer": "Detailed answer 1" }
    ],
    "seo_info": {
        "primary_keyword": "Primary keyword from product category",
        "long_tail_keywords": ["5-7 relevant long-tail keywords"],
        "meta_description": "150-160 characters meta description with primary keyword.",
        "related_topics": ["3-5 broader topics related to the product"]
    },
    "structured_data": {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Product name",
        "description": "Meta description",
        "manufacturer": { "@type": "Organization", "name": "Manufacturer name" },
        "sku": "Extract SKU or Model Number if available"
    }
  }]
}

Important: Extract ALL technical specifications from the product page, translate everything to English, create SEO-optimized descriptions with keyword research in mind. Do NOT include brand names or company information.`;

                        // Prompt'u textarea'ya otomatik yapıştır
                        const textarea = document.querySelector('textarea[placeholder*="ChatGPT"]') as HTMLTextAreaElement;
                        if (textarea) {
                          textarea.value = prompt;
                        }
                      }
                    }}
                  />
                </div>
                <div className="text-xs text-green-600">
                  👆 Tek ürün için otomatik prompt üretir
                </div>
              </div>
            </div>

            {/* Çoklu Link */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-800">📦 Çoklu Ürün Linkleri</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-700">Çoklu Ürün Linkleri:</label>
                  <Textarea
                    placeholder={`Her satıra bir link gelecek şekilde yapıştırın:
https://site1.com/urun/1
https://site1.com/urun/2
https://site2.com/product/3
https://site2.com/product/4`}
                    rows={4}
                    onChange={(e) => {
                      const links = e.target.value.split('\n').filter(link => link.trim());
                      if (links.length > 0) {
                        const linkList = links.map((link, index) => `Link ${index + 1}: ${link}`).join('\n');
                        const prompt = `Analyze these product pages and create SEO-optimized content in English JSON format:

${linkList}

SEO REQUIREMENTS FOR EACH PRODUCT:
- Primary keyword: Extract from product category (e.g., "feed mixers", "industrial equipment")
- Long-tail keywords: Create 5-7 relevant long-tail keywords
- Meta description: 150-160 characters with primary keyword
- Content structure: H1, H2, H3 with keywords
- Keyword density: 1.5-2% for main keywords

IMPORTANT: Only extract information that ACTUALLY EXISTS on EACH page. Do NOT invent, assume, or estimate any features, specifications, or details that are not explicitly stated on the product pages.

Translate all content to English and create SEO-optimized, compelling product descriptions with different wording than the original for EACH product. Focus on search engine optimization while maintaining factual accuracy.

Return ONLY the following JSON format (no other text):
{
  "products": [
    {
      "name": "Product name in English",
      "manufacturer": "Manufacturer name in English",
      "price": "Contact for Price",
      "description": "Short, compelling English description (150-160 characters).",
      "rich_description": "Create a detailed, SEO-optimized product description in HTML format. Use H2 and H3 tags for headings, bullet points (ul/li) for key features, and bold text (strong) for important terms.",
      "features": ["Feature 1", "Feature 2"],
      "images": [
          { "url": "image1.jpg", "alt": "Descriptive alt text for image 1" }
      ],
      "badge": "Professional",
      "status": "active",
      "is_featured": false,
      "technical_specs": {
        "Key": "Value format, extracting ALL technical specs"
      },
      "additional_info": [
          { "question": "Relevant FAQ 1?", "answer": "Detailed answer 1" }
      ],
      "seo_info": {
          "primary_keyword": "Primary keyword from product category",
          "long_tail_keywords": ["5-7 relevant long-tail keywords"],
          "meta_description": "150-160 characters meta description with primary keyword.",
          "related_topics": ["3-5 broader topics related to the product"]
      },
      "structured_data": {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "Product name",
          "description": "Meta description",
          "manufacturer": { "@type": "Organization", "name": "Manufacturer name" },
          "sku": "Extract SKU or Model Number if available"
      }
    }
    // Add one product object for each link
  ]
}

Important: Extract ALL technical specifications from EACH product page, translate everything to English, create SEO-optimized descriptions with keyword research in mind. Do NOT include brand names or company information.`;

                        // Prompt'u textarea'ya otomatik yapıştır
                        const textarea = document.querySelector('textarea[placeholder*="ChatGPT"]') as HTMLTextAreaElement;
                        if (textarea) {
                          textarea.value = prompt;
                        }
                      }
                    }}
                  />
                </div>
                <div className="text-xs text-blue-600">
                  👆 Çoklu ürün için otomatik prompt üretir
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                JSON dosyanızı sürükleyip bırakın veya
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                📁 Dosya Seçin
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-sm text-gray-500">
                Sadece .json dosyaları desteklenir
              </p>
            </div>

            {/* Manual JSON Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Veya Manuel JSON Girişi:</label>
              <Textarea
                placeholder={`ChatGPT'den aldığınız JSON'ı buraya yapıştırın...`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleImport}
              disabled={isImporting || !jsonInput.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Import Ediliyor...
                </>
              ) : (
                <>
                  🚀 Ürünleri Ekle
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">İşlem Sonucu</h3>

          {result ? (
            <div className="space-y-4">
              {/* Status */}
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                result.success
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="font-semibold">
                    {result.success ? 'Başarılı!' : 'Hata!'}
                  </p>
                  <p>
                    {result.imported} ürün eklendi, {result.errors} hata
                  </p>
                </div>
              </div>

              {/* Success Details */}
              {result.products && result.products.length > 0 && (
                <div>
                  <p className="font-semibold mb-3 text-green-700">✅ Eklenen Ürünler:</p>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {result.products.map((product, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                        <p className="font-medium text-green-800">{product.name}</p>
                        <p className="text-green-600 text-xs">ID: {product.id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Details */}
              {result.error_details && result.error_details.length > 0 && (
                <div>
                  <p className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Hata Detayları:
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.error_details.map((error, index) => (
                      <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-12">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Henüz işlem yapılmadı</p>
              <p className="text-sm mt-2">JSON yükleyip import işlemini başlatın</p>
            </div>
          )}
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-lg">📋 Nasıl Kullanırsınız:</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-blue-700">1. ChatGPT ile Veri Çekme</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>ChatGPT'ye ürün linkini verin</li>
              <li>JSON formatında veri isteyin</li>
              <li>Elde ettiğiniz JSON'u kopyalayın</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-700">2. Siteye Aktarma</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>JSON'u yukarıdaki alana yapıştırın</li>
              <li>"Ürünleri Ekle" butonuna basın</li>
              <li>Sistem otomatik ekleme yapacak</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-4">
            <strong>💡 ChatGPT Prompt (Kopyalayıp Kullanın):</strong>
          </p>
          <div className="bg-white p-3 rounded border text-xs font-mono text-gray-700 mb-4">
            Analyze this product page and provide the information in English JSON format:
            <br /><br />
            [PRODUCT_URL_HERE]
            <br /><br />
            Translate all content to English and create a compelling product description with different wording than the original.
            <br /><br />
            Return ONLY the following JSON format (no other text):
            <br />
            {`{`}
            <br />
            {`  "products": [{`}
            <br />
            {`    "name": "Product name in English",`}
            <br />
            {`    "manufacturer": "Manufacturer name in English",`}
            <br />
            {`    "price": "Contact for Price",`}
            <br />
            {`    "description": "Short, compelling English description (150-160 characters).",`}
            <br />
            {`    "rich_description": "Detailed HTML description with H2, H3, ul, li, strong tags.",`}
            <br />
            {`    "features": ["Feature 1", "Feature 2"],`}
            <br />
            {`    "images": [{ "url": "image1.jpg", "alt": "Descriptive alt text" }],`}
            <br />
            {`    "badge": "Professional",`}
            <br />
            {`    "status": "active",`}
            <br />
            {`    "is_featured": false,`}
            <br />
            {`    "technical_specs": { "Key": "Value" },`}
            <br />
            {`    "additional_info": [{ "question": "FAQ?", "answer": "Answer" }],`}
            <br />
            {`    "seo_info": { ... },`}
            <br />
            {`    "structured_data": { ... }`}
            <br />
            {`  }]`}
            <br />
            {`}`}
            <br /><br />
            Important: Extract ALL technical specifications from the product page, translate everything to English, create original descriptions.
          </div>
          <p className="text-xs text-blue-700">
            👆 Bu prompt'u kopyalayıp ChatGPT'ye yapıştırın, [PRODUCT_URL_HERE] yerine gerçek ürün linkini koyun
          </p>
        </div>
      </Card>

      {/* Example JSON */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">📄 Örnek JSON Formatı:</h3>
        <details className="group">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            Geçerli İngilizce JSON formatını görmek için tıklayın
          </summary>
          <pre className="mt-4 p-4 bg-gray-50 rounded-lg text-xs font-mono text-gray-700 overflow-x-auto">
{`{
  "products": [
    {
      "name": "Industrial Mixer Machine 500L",
      "manufacturer": "ABC Manufacturing Ltd",
      "price": "Contact for Price",
      "description": "High-performance industrial mixer designed for efficient blending of various materials in manufacturing processes.",
      "rich_description": "<h2>Advanced Industrial Mixing Solution</h2><p>Our <strong>IM-500 model</strong> is engineered for excellence, providing consistent and reliable blending for a wide range of industrial applications. Features robust stainless steel construction and a digital PLC panel for precise control.</p><h3>Key Advantages:</h3><ul><li>Variable speed control (0-100 RPM)</li><li>Easy-to-clean design with safety interlock system</li><li>Durable Stainless Steel 304 material</li></ul>",
      "features": [
        "Stainless steel construction",
        "Variable speed control",
        "Safety interlock system",
        "Easy cleaning design",
        "Digital control panel"
      ],
      "images": [
        {
          "url": "https://example.com/mixer1.jpg",
          "alt": "Front view of the 500L Industrial Mixer Machine"
        },
        {
          "url": "https://example.com/mixer2.jpg",
          "alt": "Control panel of the ABC Manufacturing Industrial Mixer"
        }
      ],
      "badge": "Professional",
      "status": "active",
      "is_featured": false,
      "technical_specs": {
        "Capacity": "500 Liters",
        "Power": "15 kW",
        "Voltage": "380V",
        "Dimensions": "120x80x150 cm",
        "Weight": "350 kg",
        "Model": "IM-500"
      },
      "additional_info": [
        {
          "question": "What is the required maintenance for this mixer?",
          "answer": "Regular maintenance includes daily cleaning, weekly lubrication of moving parts, and a monthly inspection of the motor and belts. Please refer to the user manual for a detailed schedule."
        }
      ],
      "seo_info": {
        "primary_keyword": "Industrial Mixer",
        "long_tail_keywords": [
          "500L stainless steel mixer",
          "heavy-duty industrial blender",
          "variable speed mixing machine for manufacturing"
        ],
        "meta_description": "Discover the high-performance 500L Industrial Mixer Machine from ABC Manufacturing. Perfect for heavy-duty applications with variable speed control and robust construction.",
        "related_topics": [
          "Material Blending Processes",
          "Manufacturing Efficiency",
          "Industrial Automation"
        ]
      },
      "structured_data": {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Industrial Mixer Machine 500L",
        "description": "Discover the high-performance 500L Industrial Mixer Machine from ABC Manufacturing. Perfect for heavy-duty applications with variable speed control and robust construction.",
        "manufacturer": {
          "@type": "Organization",
          "name": "ABC Manufacturing Ltd"
        },
        "sku": "IM-500"
      }
    }
  ]
}`}
          </pre>
        </details>
      </Card>
    </div>
  );
}
