import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/database';

export async function POST() {
  const supabase = createAdminClient();

  try {
    // 1. Fetch all products with their SEO data using getProducts
    const products = await getProducts({ include_seo: true });
    console.log("Products fetched in generate route:", JSON.stringify(products, null, 2));

    // 2. Fetch all existing pending tasks to avoid duplicates
    const { data: existingTasks, error: tasksError } = await supabase
      .from('seo_tasks')
      .select('product_id, task')
      .eq('status', 'pending');

    if (tasksError) {
      console.error('Error fetching existing tasks:', tasksError);
      return NextResponse.json({ error: 'Could not fetch existing tasks' }, { status: 500 });
    }

    const newTasks = [];
    const existingTaskSet = new Set(
      existingTasks.map(task => `${task.product_id}-${task.task}`)
    );

    const today = new Date();
    const dueDate = new Date(new Date().setDate(today.getDate() + 7)).toISOString().split('T')[0];

    // 3. Analyze each product and generate tasks if needed
    for (const product of products) {
      if (!product.slug) {
        continue;
      }

      // Task for improving SEO score
      const improveSeoTask = `Improve SEO score for "${product.name}"`;
      if ((product.seo_score ?? 0) < 60 && !existingTaskSet.has(`${product.id}-${improveSeoTask}`)) {
        newTasks.push({
          product_id: product.id,
          product_slug: product.slug,
          product_name: product.name,
          task: improveSeoTask,
          status: 'pending',
          priority: 'medium',
          due_date: dueDate,
          notes: `Current SEO score is ${product.seo_score ?? 0}. Aim for a score above 80.`,
        });
      }

      // Task for writing a meta description
      const writeMetaTask = `Write a meta description for "${product.name}"`;
      if (!product.has_meta_description && !existingTaskSet.has(`${product.id}-${writeMetaTask}`)) {
        newTasks.push({
          product_id: product.id,
          product_slug: product.slug,
          product_name: product.name,
          task: writeMetaTask,
          status: 'pending',
          priority: 'high',
          due_date: dueDate,
          notes: 'A compelling meta description is crucial for click-through rates.',
        });
      }

      // Task for creating blog content
      const createBlogTask = `Create blog content for "${product.name}"`;
      if (!product.has_blog_content && !existingTaskSet.has(`${product.id}-${createBlogTask}`)) {
        newTasks.push({
          product_id: product.id,
          product_slug: product.slug,
          product_name: product.name,
          task: createBlogTask,
          status: 'pending',
          priority: 'low',
          due_date: new Date(new Date().setDate(today.getDate() + 14)).toISOString().split('T')[0],
          notes: 'Content marketing helps build authority and attract organic traffic.',
        });
      }
    }

    // 4. Insert new tasks into the database
    if (newTasks.length > 0) {
      const { error: insertError } = await supabase.from('seo_tasks').insert(newTasks);
      if (insertError) {
        console.error('Error inserting new tasks:', insertError);
        return NextResponse.json({ error: 'Could not insert new tasks' }, { status: 500 });
      }
      return NextResponse.json({ message: `${newTasks.length} new SEO tasks generated successfully.` });
    }

    return NextResponse.json({ message: 'No new SEO tasks needed.' });

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
