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
    const suggestedTitles = [
      `Everything You Need to Know About ${topic}`,
      `The Best ${topic} Solutions and Their Prices`,
      `Key Considerations When Choosing ${topic} in ${year}`
    ];
    const primaryKeyword = topic;
    const secondaryKeywords = products.flatMap((p: any) => p.seo_info?.long_tail_keywords || []);
    const lsiKeywords = products.flatMap((p: any) => p.seo_info?.related_topics || []).filter((t: string) => t !== topic);

    // Function to generate a slug from a string
    const createSlug = (text: string) =>
      text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    // Transform the brief outline into the required content structure
    const content = [
      {
        type: 'heading',
        level: 2,
        text: `Introduction: Welcome to the World of ${topic}`,
      },
      {
        type: 'paragraph',
        text: `Hook the reader immediately. Acknowledge their primary pain point or need. Briefly explain how this article will provide a solution. (Instruction)`,
      },
      {
        type: 'heading',
        level: 2,
        text: `What is ${topic} and Why is it Crucial for Your Business?`,
      },
      {
        type: 'paragraph',
        text: `Provide a clear definition of the topic and explain its importance for businesses with 2-3 concrete examples. Naturally incorporate terms from the 'secondary_keywords' and 'lsi_keywords' lists in this section. (Instruction)`,
      },
      {
        type: 'image',
        url: `https://source.unsplash.com/800x400/?${encodeURIComponent(topic)}`,
        alt: `An image representing ${topic}`,
      },
      {
        type: 'heading',
        level: 2,
        text: `Our Top Solutions for ${topic}`,
      },
      {
        type: 'paragraph',
        text: `This is the most critical section for internal linking. Introduce the following products within a fluent text, highlighting their features and benefits. Use the product name as the anchor text for the provided URL. Discuss each product under an h3 heading. (Instruction)`,
      },
      ...internalLinks.flatMap(link => [
        {
          type: 'heading',
          level: 3,
          text: link.product_name,
        },
        {
          type: 'paragraph',
          text: `Talking Points: ${link.talking_points.join(', ')}. Link to: ${link.product_url}`,
        }
      ]),
      {
        type: 'heading',
        level: 2,
        text: `Frequently Asked Questions (FAQ) about ${topic}`,
      },
      {
        type: 'faq',
        questions: [
          { question: `What is the main benefit of ${topic}?`, answer: 'Provide a detailed answer here.' },
          { question: `How to choose the right ${topic}?`, answer: 'Provide a detailed answer here.' },
          { question: `What are the costs associated with ${topic}?`, answer: 'Provide a detailed answer here.' },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Conclusion: Take the Right Step for Your Business',
      },
      {
        type: 'paragraph',
        text: `Summarize the main points of the article. Briefly reiterate what the reader has learned and guide them to action. Contact our expert team today for more information, to discuss custom solutions for your project, or to receive a competitive price quote. (Instruction)`,
      },
    ];

    const finalJson = {
      title: suggestedTitles[0],
      slug: createSlug(suggestedTitles[0]),
      excerpt: `The ultimate guide to ${topic}. Discover our products and solutions. Meet our expert team.`,
      content: content,
      author: 'Azultrade Expert',
      author_role: 'Industry Specialist', // Added field
      category: 'Industry Insights',
      tags: [primaryKeyword, ...secondaryKeywords.slice(0, 4)],
      image: `https://source.unsplash.com/1200x630/?${encodeURIComponent(topic)}`,
      featured: false, // Added field
      status: 'draft',
      publish_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      read_time: '8 min read',
      related_products: internalLinks.map(p => ({ id: p.product_url.split('/').pop() || '', name: p.product_name, slug: p.product_url.split('/').pop() || '' }))
    };

    return NextResponse.json(finalJson);

  } catch (error: any) {
    console.error('Error creating AI brief:', error);
    return NextResponse.json({ error: 'Failed to create AI brief', details: error.message }, { status: 500 });
  }
}
