import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n";

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

export async function middleware(request: NextRequest) {
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

  // Let (app) paths pass through — auth guard is in app/(app)/layout.tsx
  for (const appPath of APP_PATHS) {
    if (pathname === appPath || pathname.startsWith(`${appPath}/`)) {
      return NextResponse.next();
    }
  }

  // Apply next-intl locale routing for all other (public) pages
  return intlMiddleware(request);
}

export const config = {
  // Skip static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
