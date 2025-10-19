import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This client is for authenticated user sessions on the server-side
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use anon key for user sessions
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // This 'set' is typically handled by Next.js when using createServerClient
          // in a Server Component. We can provide a no-op or log for debugging.
          // For Route Handlers or Server Actions, cookieStore.set would be used directly.
          console.warn('Supabase server client: Attempted to set cookie from a read-only context.');
        },
        remove(name: string, options: CookieOptions) {
          // Similar to set, this is usually handled by Next.js.
          console.warn('Supabase server client: Attempted to remove cookie from a read-only context.');
        },
      },
    }
  );
}

// This client is for direct admin operations using the service role key
// It does not rely on user sessions or cookies.
export const createAdminClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
      // Provide dummy cookie methods as they are required by createServerClient
      // but not used for service role key operations.
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    }
  );
};
