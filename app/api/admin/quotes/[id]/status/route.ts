import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'processed', 'completed', 'cancelled']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { status } = validation.data;

    const { data, error } = await supabase
      .from('quotes')
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote status:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Quote not found.' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update quote status.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}