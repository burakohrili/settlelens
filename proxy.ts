import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./routing";

// (app) route group pages — no locale prefix, auth handled by (app)/layout.tsx
const APP_PATHS = [
  "/dashboard",
  "/onboarding",
  "/scenarios",
  "/report",
  "/settings",
  "/upgrade",
];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix if someone lands on /tr/onboarding/step-1 etc.
  // (app) pages have no locale in their URL — redirect to correct path
  for (const locale of locales) {
    for (const appPath of APP_PATHS) {
      if (
        pathname === `/${locale}${appPath}` ||
        pathname.startsWith(`/${locale}${appPath}/`)
      ) {
        const corrected = pathname.slice(`/${locale}`.length);
        return NextResponse.redirect(new URL(corrected, request.url));
      }
    }
  }

  // For (app) paths: refresh the Supabase session so server components always
  // receive valid, up-to-date cookies. Without this, token refreshes are lost
  // between the Edge proxy and the server component render.
  for (const appPath of APP_PATHS) {
    if (pathname === appPath || pathname.startsWith(`${appPath}/`)) {
      let supabaseResponse = NextResponse.next({ request });

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              // Forward refreshed cookies to the server component via the request,
              // and write them to the response so the browser stores the new tokens.
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              supabaseResponse = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      // Calling getUser() triggers a token refresh if the access token is near expiry.
      // The auth guard itself lives in (app)/layout.tsx — this is only for cookie hygiene.
      await supabase.auth.getUser();

      // Propagate locale cookie so i18n.ts always has a reliable source across
      // client navigations (intlMiddleware is skipped for (app) routes).
      const existingLocale =
        request.cookies.get("SETTLELENS_LOCALE")?.value ??
        request.cookies.get("NEXT_LOCALE")?.value;
      if (existingLocale && (locales as readonly string[]).includes(existingLocale)) {
        supabaseResponse.cookies.set("SETTLELENS_LOCALE", existingLocale, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
          httpOnly: false,
        });
      }

      // Expose resolved locale to server-component pages via response header.
      supabaseResponse.headers.set(
        "x-locale",
        existingLocale && (locales as readonly string[]).includes(existingLocale)
          ? existingLocale
          : defaultLocale
      );

      // Expose pathname to server-component layouts (used for onboarding redirect guard).
      supabaseResponse.headers.set("x-pathname", pathname);

      return supabaseResponse;
    }
  }

  // API routes must not go through intlMiddleware (it would redirect /api/* to /en/api/*)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Apply next-intl locale routing for all other (public) pages
  return intlMiddleware(request);
}

export const config = {
  // Skip static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
