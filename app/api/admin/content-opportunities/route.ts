import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createClient();

    // Sadece seo_info sütununu çekerek sorguyu optimize et
    const { data: products, error } = await supabase
      .from('products')
      .select('seo_info');

    if (error) {
      throw new Error(error.message);
    }

    if (!products) {
      return NextResponse.json([]);
    }

    const topicCounts: { [key: string]: number } = {};

    // Tüm ürünlerin related_topics alanlarını işle
    products.forEach(product => {
      if (product.seo_info && Array.isArray((product.seo_info as any).related_topics)) {
        (product.seo_info as any).related_topics.forEach((topic: string) => {
          if (topic) {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          }
        });
      }
    });

    // Sonuçları { topic: string, count: number } formatında bir diziye dönüştür
    const sortedTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count); // En çok geçenden en aza doğru sırala

    return NextResponse.json(sortedTopics);

  } catch (error: any) {
    console.error('Error fetching content opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content opportunities', details: error.message },
      { status: 500 }
    );
  }
}
