import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl;

  // Eğer kullanıcı giriş yapmamışsa ve /admin yoluna erişmeye çalışıyorsa
  // onu /login sayfasına yönlendir. /login sayfasının kendisini döngüye sokmamak için kontrol ekliyoruz.
  if (!session && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Eğer kullanıcı giriş yapmışsa ve /login sayfasına gitmeye çalışıyorsa
  // onu /admin sayfasına yönlendir.
  if (session && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Ürün ID'sinden slug'a yönlendirme
  const productPathRegex = /^\/products\/(\d+)$/;
  const match = pathname.match(productPathRegex);

  if (match) {
    const productId = match[1];
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('slug')
        .eq('id', productId)
        .single();

      if (error) {
        console.error(`Middleware: Ürün ID'si ${productId} için slug aranırken veritabanı hatası:`, error.message);
      }

      if (product && product.slug) {
        const newUrl = request.nextUrl.clone();
        newUrl.pathname = `/products/${product.slug}`;
        console.log(`Middleware: Yönlendiriliyor: ${pathname} -> ${newUrl.pathname}`);
        return NextResponse.redirect(newUrl, 301); // Kalıcı yönlendirme
      }
    } catch (e) {
      console.error(`Middleware: Yönlendirme sırasında beklenmedik hata:`, e);
    }
  }

  return response
}

// Middleware'in hangi yollarda çalışacağını belirtir.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}