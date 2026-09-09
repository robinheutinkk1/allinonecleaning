import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Beschermt /admin: ververst de Supabase-sessie en stuurt bezoekers zonder
 * sessie naar /admin/login. De definitieve check (incl. ADMIN_EMAILS) gebeurt
 * server-side in lib/admin/auth.ts.
 */
export async function proxy(request: NextRequest) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  ).trim();

  const isLogin = request.nextUrl.pathname.startsWith("/admin/login");

  if (!url || !key) {
    if (!isLogin) return NextResponse.redirect(new URL("/admin/login?reden=config", request.url));
    const bare = NextResponse.next();
    bare.headers.set("X-Robots-Tag", "noindex, nofollow");
    return bare;
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("volgende", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
