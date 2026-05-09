import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { locales } from "@/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

const AUTH_REQUIRED = [
  "/dashboard",
  "/onboarding",
  "/scenarios",
  "/report",
  "/settings",
  "/upgrade",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to check route (e.g. /en/dashboard → /dashboard)
  const pathnameWithoutLocale = pathname.replace(/^\/(en|tr|de|fr|es|ar)/, "") || "/";

  const needsAuth = AUTH_REQUIRED.some((p) => pathnameWithoutLocale.startsWith(p));

  if (needsAuth) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase keys are placeholders, skip auth guard during dev
    if (supabaseUrl && !supabaseUrl.includes("placeholder") && supabaseKey && !supabaseKey.includes("placeholder")) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Preserve locale in redirect
        const locale = pathname.match(/^\/(en|tr|de|fr|es|ar)/)?.[1] ?? "en";
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
