import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // This route should be protected and only accessible by admin users.
    // For now, we assume the check is handled by RLS or a middleware.

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (status && status !== 'Tümü') {
      query = query.eq('status', status);
    }
    
    if (search) {
        query = query.or(`full_name.ilike.%${search}%,subject.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json({ error: 'Failed to fetch messages.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      count,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // This route should be protected and only accessible by admin users.
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Message IDs are required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete messages.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Messages deleted successfully.' });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}