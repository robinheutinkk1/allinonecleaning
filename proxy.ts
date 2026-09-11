import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const DEMO_SESSION_COOKIE = "tp_demo_session";

/**
 * Beschermt het dashboard (/admin) en de demo-beheeromgeving (/beheer).
 *
 * - /beheer: demo-cookie vereist (gezet door de demo-loginpagina). Geen echte auth,
 *   de omgeving bevat alleen voorbeeldgegevens.
 * - /admin: ververst de sessie en stuurt bezoekers zonder sessie naar /login
 *   (ingelogde bezoekers van /login gaan door naar /admin). De definitieve check
 *   (incl. ADMIN_EMAILS) gebeurt server-side in lib/admin/auth.ts.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/beheer")) {
    const isDemoLogin = pathname === "/beheer/login";
    const hasDemo = request.cookies.get(DEMO_SESSION_COOKIE)?.value === "demo";
    if (!hasDemo && !isDemoLogin) {
      const login = new URL("/beheer/login", request.url);
      if (pathname !== "/beheer") login.searchParams.set("volgende", pathname);
      return NextResponse.redirect(login);
    }
    if (hasDemo && isDemoLogin) return NextResponse.redirect(new URL("/beheer", request.url));
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  ).trim();

  const isLogin = pathname === "/login";

  if (!url || !key) {
    if (!isLogin) return NextResponse.redirect(new URL("/login?reden=config", request.url));
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

  // Lokale JWT-controle (snel); valt automatisch terug op de Auth-server als dat nodig is.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims?.sub ? data.claims : null;

  if (!user && !isLogin) {
    const login = new URL("/login", request.url);
    login.searchParams.set("volgende", pathname);
    return NextResponse.redirect(login);
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/beheer/:path*"],
};
