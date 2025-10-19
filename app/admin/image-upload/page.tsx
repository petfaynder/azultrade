'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, Upload, Copy, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Next.js Image component

interface MediaItem {
  id: string;
  url: string;
  alt_text: string;
  file_name: string;
  created_at: string;
}

export default function ImageUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileAltTexts, setFileAltTexts] = useState<string[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchMediaLibrary();
  }, []);

  const fetchMediaLibrary = async () => {
    setLoadingMedia(true);
    try {
      const response = await fetch('/api/admin/image-upload');
      if (response.ok) {
        const data = await response.json();
        setMediaLibrary(data.media);
      } else {
        toast({
          title: "Hata",
          description: "Medya kütüphanesi yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch media library:', error);
      toast({
        title: "Hata",
        description: "Medya kütüphanesi çekilirken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      setFileAltTexts(filesArray.map(() => '')); // Initialize alt texts for new files
      console.log('Selected files:', filesArray);
    } else {
      setSelectedFiles([]);
      setFileAltTexts([]);
      console.log('No files selected.');
    }
  };

  const handleAltTextChange = (index: number, value: string) => {
    const newAltTexts = [...fileAltTexts];
    newAltTexts[index] = value;
    setFileAltTexts(newAltTexts);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Uyarı",
        description: "Lütfen yüklenecek resim dosyalarını seçin.",
      });
      return;
    }

    setLoadingUpload(true);
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append('images', file);
      formData.append('altTexts', fileAltTexts[index]);
    });

    console.log('Uploading files:', selectedFiles.map(f => f.name));
    console.log('Alt texts:', fileAltTexts);

    try {
      const response = await fetch('/api/admin/image-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful, response:', data);
        toast({
          title: "Başarılı",
          description: `${data.uploadedImages.length} resim başarıyla yüklendi.`,
        });
        setSelectedFiles([]);
        setFileAltTexts([]);
        fetchMediaLibrary(); // Refresh media library
      } else {
        const errorData = await response.json();
        console.error('Upload failed, error response:', errorData);
        toast({
          title: "Hata",
          description: `Resim yüklenirken bir hata oluştu: ${errorData.error || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to upload images (network error or unexpected):', error);
      toast({
        title: "Hata",
        description: "Resim yüklenirken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleUpdateAltText = async (id: string, newAltText: string) => {
    try {
      const response = await fetch(`/api/admin/image-upload/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text: newAltText }),
      });

      if (response.ok) {
        toast({ title: "Başarılı", description: "Alt text güncellendi." });
        fetchMediaLibrary(); // Refresh to show updated alt text
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: `Alt text güncellenirken bir hata oluştu: ${errorData.error || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to update alt text:', error);
      toast({
        title: "Hata",
        description: "Alt text güncellenirken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Başarılı",
      description: "Panoya kopyalandı.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Toaster />
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Medya Kütüphanesi</h1>
          <p className="text-slate-600 mt-2">
            Blog yazılarınızda ve ürün açıklamalarınızda kullanmak üzere resim yükleyin ve yönetin.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Resim Yükle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="image-upload">Resim Dosyaları Seçin</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple // Allow multiple file selection
              onChange={handleFileChange}
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">Yüklenecek Resimler:</h3>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                  <span className="flex-1 text-sm">{file.name}</span>
                  <Input
                    placeholder="Alt Text (SEO için)"
                    value={fileAltTexts[index]}
                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                    className="w-1/2"
                  />
                </div>
              ))}
            </div>
          )}
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || loadingUpload} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {loadingUpload ? 'Yükleniyor...' : 'Resimleri Yükle'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Mevcut Medya Kütüphanesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMedia ? (
            <p>Medya kütüphanesi yükleniyor...</p>
          ) : mediaLibrary.length === 0 ? (
            <p>Henüz yüklenmiş resim bulunmamaktadır.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaLibrary.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Image
                      src={item.url}
                      alt={item.alt_text || item.file_name}
                      layout="fill"
                      objectFit="contain"
                      className="p-2"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.file_name}</p>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`alt-text-${item.id}`} className="text-xs text-slate-600">Alt Text:</Label>
                      <Input
                        id={`alt-text-${item.id}`}
                        value={item.alt_text || ''}
                        onChange={(e) => {
                          // Optimistic update for immediate feedback
                          setMediaLibrary(prev => prev.map(media =>
                            media.id === item.id ? { ...media, alt_text: e.target.value } : media
                          ));
                        }}
                        onBlur={(e) => handleUpdateAltText(item.id, e.target.value)}
                        className="flex-1 text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.url)} className="flex-1">
                        <Copy className="h-3 w-3 mr-1" /> URL Kopyala
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.alt_text || '')} className="flex-1">
                        <Copy className="h-3 w-3 mr-1" /> Alt Text Kopyala
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
