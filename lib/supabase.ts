/**
 * @deprecated Lütfen `@/lib/supabase/client` veya `@/lib/supabase/server` modüllerini kullanın.
 * Bu dosya geriye dönük uyumluluk için korunmaktadır.
 */
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * @deprecated Lütfen `createClient` fonksiyonunu `@/lib/supabase/client`'tan import edin.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// supabaseAdmin'in hala gerekli olup olmadığını kontrol etmek gerekir.
// Eğer projenin başka bir yerinde kullanılıyorsa, bu yapıyı korumak önemlidir.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceKey
  ? createBrowserClient(supabaseUrl, supabaseServiceKey)
  : null
