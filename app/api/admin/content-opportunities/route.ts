import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    // 1. Get all products with their related topics
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, seo_info');
    if (productsError) throw productsError;

    // 2. Aggregate topics and related products from the products data
    const topicData: { [key: string]: { count: number; products: { id: string; name: string; slug: string }[] } } = {};
    products?.forEach((product: any) => {
      if (product.seo_info && Array.isArray(product.seo_info.related_topics)) {
        product.seo_info.related_topics.forEach((topic: string) => {
          if (topic) {
            if (!topicData[topic]) {
              topicData[topic] = { count: 0, products: [] };
            }
            topicData[topic].count++;
            topicData[topic].products.push({ id: product.id, name: product.name, slug: product.slug });
          }
        });
      }
    });

    const allTopics = Object.keys(topicData);

    // 3. Upsert all discovered topics into the content_opportunities table
    if (allTopics.length > 0) {
      const topicsToUpsert = allTopics.map(topic => ({ topic }));
      const { error: upsertError } = await supabase.from('content_opportunities').upsert(topicsToUpsert, { onConflict: 'topic' });
      if (upsertError) throw upsertError;
    }

    // 4. Fetch all content opportunities with their linked blog posts
    const { data: opportunities, error: opportunitiesError } = await supabase
      .from('content_opportunities')
      .select(`
        topic,
        content_opportunity_blog_posts (
          blog_posts (
            id,
            title,
            slug
          )
        )
      `);
    if (opportunitiesError) throw opportunitiesError;

    const opportunitiesMap = new Map(opportunities?.map((op: any) => [
      op.topic,
      op.content_opportunity_blog_posts.map((p: any) => p.blog_posts).filter(Boolean)
    ]) || []);

    // 5. Combine the aggregated product data with the linked blog posts
    const combinedData = Object.entries(topicData)
      .map(([topic, data]) => {
        const linked_blog_posts = opportunitiesMap.get(topic) || [];
        return {
          topic,
          count: data.count,
          products: data.products,
          status: linked_blog_posts.length > 0 ? 'completed' : 'pending',
          linked_blog_posts,
        };
      })
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(combinedData);

  } catch (error: any) {
    console.error('Error fetching content opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch content opportunities', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { topic, blog_post_id } = await request.json();

    if (!topic || !blog_post_id) {
      return NextResponse.json({ error: 'Missing topic or blog_post_id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('content_opportunity_blog_posts')
      .insert({ topic, blog_post_id });

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error('Error linking blog post:', error);
    return NextResponse.json({ error: 'Failed to link blog post', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { topic, blog_post_id } = await request.json();

    if (!topic || !blog_post_id) {
      return NextResponse.json({ error: 'Missing topic or blog_post_id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('content_opportunity_blog_posts')
      .delete()
      .match({ topic, blog_post_id });

    if (error) throw error;

    return NextResponse.json({ message: 'Blog post unlinked successfully' });

  } catch (error: any) {
    console.error('Error unlinking blog post:', error);
    return NextResponse.json({ error: 'Failed to unlink blog post', details: error.message }, { status: 500 });
  }
}
