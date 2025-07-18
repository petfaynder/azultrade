import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

// Define the schema for the contact form data
const contactFormSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone_number: z.string().optional(),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message_content: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get IP address from request headers
    const ip_address = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'Unknown';

    // Validate the request body against the schema
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { full_name, email, phone_number, subject, message_content } = validation.data;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured.' }, { status: 500 });
    }

    // Insert the data using the admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([
        {
          full_name,
          email,
          phone_number,
          subject,
          message_content,
          ip_address
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save message.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully!', data }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}