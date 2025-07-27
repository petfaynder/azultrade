import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const quoteItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  notes: z.string().optional(),
});

const createQuoteSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_email: z.string().email("Invalid email address"),
  company_name: z.string().optional(),
  phone_number: z.string().optional(),
  message: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required in the quote"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createQuoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { customer_name, customer_email, company_name, phone_number, message, items } = validation.data;

    try {
      const { data: newQuoteId, error } = await supabase.rpc('create_quote_with_items', {
        customer_name_in: customer_name,
        customer_email_in: customer_email,
        company_name_in: company_name,
        phone_number_in: phone_number,
        message_in: message,
        items_in: items,
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        return NextResponse.json({ error: 'Failed to submit quote request.' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Quote request submitted successfully', quoteId: newQuoteId }, { status: 201 });
    } catch (error) {
      console.error('Database operation failed:', error);
      return NextResponse.json({ error: 'Failed to submit quote request.' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}