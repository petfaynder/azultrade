import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { topic, products } = await request.json();

    if (!topic || !products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Missing topic or products' }, { status: 400 });
    }

    // Fetch full product details to get more context for talking points
    const productIds = products.map((p: any) => p.id);
    const { data: fullProducts, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, rich_description, features, seo_info')
      .in('id', productIds);

    if (productsError) throw productsError;

    const internalLinks = fullProducts?.map(product => {
        const seoInfo = product.seo_info as any;
        return {
            product_name: product.name,
            product_url: `/products/${product.slug}`,
            talking_points: [
                `Highlight its primary use case related to ${seoInfo?.primary_keyword || product.name}.`,
                ...(product.features || []).slice(0, 2),
                `Mention its benefits from the description: ${product.rich_description?.substring(0, 100)}...`
            ]
        };
    }) || [];
    
    const year = new Date().getFullYear();

    const jsonBrief = {
      "execution_instructions": {
        "task": "Generate a comprehensive, SEO-optimized blog post.",
        "word_count_target": "1200-1500 words",
        "language": "English",
        "expert_persona": "Adopt the persona of an industry expert with over 10 years of experience in international trade and logistics, writing for the Azultrade blog. Your tone should be authoritative, helpful, and professional."
      },
      "seo_parameters": {
        "primary_keyword": topic,
        "secondary_keywords": products.flatMap((p: any) => p.seo_info?.long_tail_keywords || []),
        "lsi_keywords": products.flatMap((p: any) => p.seo_info?.related_topics || []).filter((t: string) => t !== topic),
        "target_audience": "Procurement managers in the construction sector, importers of agricultural machinery, or related fields.",
        "content_goal": `To convince users searching for "${topic}" that our related products are the ideal solution, and to drive traffic to these product pages.`,
        "negative_keywords": ["cheap", "free", "discount", "competitor brand names"]
      },
      "content_structure": {
        "featured_image_prompt": `Generate a professional, high-resolution stock photo URL for a blog post about "${topic}". The image should be relevant to international trade, logistics, or the specific industry of the products.`,
        "blog_post_title_suggestions": [
          `Everything You Need to Know About ${topic}`,
          `The Best ${topic} Solutions and Their Prices`,
          `Key Considerations When Choosing ${topic} in ${year}`
        ],
        "meta_description_suggestion": `The ultimate guide to ${topic}. Discover our products and solutions. Meet our expert team.`,
        "outline": [
          {
            "type": "h2",
            "title": `Introduction: Welcome to the World of ${topic}`,
            "instruction": "Hook the reader immediately. Acknowledge their primary pain point or need. Briefly explain how this article will provide a solution."
          },
          {
            "type": "h2",
            "title": `What is ${topic} and Why is it Crucial for Your Business?`,
            "instruction": "Provide a clear definition of the topic and explain its importance for businesses with 2-3 concrete examples. Naturally incorporate terms from the 'secondary_keywords' and 'lsi_keywords' lists in this section. Include a relevant stock photo URL after the first paragraph.",
            "image_prompt": `Find a stock photo URL representing the concept of "${topic}" in a business or industrial context.`
          },
          {
            "type": "h2",
            "title": `Our Top Solutions for ${topic}`,
            "instruction": "This is the most critical section for internal linking. Introduce the following products within a fluent text, highlighting their features and benefits. Use the product name as the anchor text for the provided URL. Discuss each product under an h3 heading.",
            "internal_links": internalLinks
          },
          {
            "type": "h2",
            "title": `Frequently Asked Questions (FAQ) about ${topic}`,
            "instruction": "Create a list of at least 3, and no more than 5, frequently asked questions and their answers. This increases the chance of appearing in 'People Also Ask' boxes."
          },
          {
            "type": "h2",
            "title": "Conclusion: Take the Right Step for Your Business",
            "instruction": "Summarize the main points of the article. Briefly reiterate what the reader has learned and guide them to action with the 'call_to_action' text below."
          }
        ]
      },
      "call_to_action": {
        "text": "Contact our expert team today for more information, to discuss custom solutions for your project, or to receive a competitive price quote.",
        "button_text": "Get a Quote"
      }
    };

    return NextResponse.json(jsonBrief);

  } catch (error: any) {
    console.error('Error creating AI brief:', error);
    return NextResponse.json({ error: 'Failed to create AI brief', details: error.message }, { status: 500 });
  }
}
