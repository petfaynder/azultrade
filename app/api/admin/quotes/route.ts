import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        id,
        customer_name,
        customer_email,
        company_name,
        status,
        created_at,
        quote_items (
          quantity,
          notes,
          products (
            name,
            manufacturer
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
      return NextResponse.json({ error: 'Failed to fetch quotes.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}