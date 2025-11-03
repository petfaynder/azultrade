import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  const { id } = params;
  const { status } = await request.json();

  try {
    const { data, error } = await supabase
      .from('seo_tasks')
      .update({ status: status, completed_at: status === 'completed' ? new Date().toISOString() : null })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating SEO task:', error);
      return NextResponse.json({ error: 'Could not update SEO task' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
