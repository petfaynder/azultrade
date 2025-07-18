import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client-side (public) client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side (admin) client - DO NOT EXPOSE TO CLIENT
// We check if the service key is available before creating the admin client
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null
