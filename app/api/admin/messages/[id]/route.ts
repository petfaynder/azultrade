import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    // First, fetch the message
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch message.', details: fetchError.message }, { status: 500 });
    }

    // If the message status is 'Yeni', update it to 'Okundu'
    if (message.status === 'Yeni') {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ status: 'Okundu' })
        .eq('id', id);

      if (updateError) {
        // Log the error but don't block the response
        console.error('Supabase status update error:', updateError);
      } else {
        // If update is successful, reflect it in the returned data
        message.status = 'Okundu';
      }
    }

    return NextResponse.json(message);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}