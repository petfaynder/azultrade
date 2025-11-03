import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();

  try {
    const { data: tasks, error } = await supabase
      .from('seo_tasks')
      .select(`
        *,
        products (
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching SEO tasks:', error);
      return NextResponse.json({ error: 'Could not fetch SEO tasks' }, { status: 500 });
    }

    // Manually map the slug from the nested products object to the product_slug field
    const tasksWithSlugs = tasks.map(task => {
      // Handle case where product might be deleted
      if (!task.products) {
        return {
          ...task,
          product_slug: null,
        };
      }
      return {
        ...task,
        product_slug: task.products.slug,
      }
    });


    return NextResponse.json(tasksWithSlugs);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
