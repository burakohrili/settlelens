import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? `/${lang}/dashboard`;

  if (code) {
    // Create the redirect response first so Supabase can write session cookies directly onto it.
    // Using createClient() from server.ts would call cookieStore.set() via next/headers,
    // but NextResponse.redirect() creates a fresh response that doesn't carry those cookies.
    const redirectResponse = NextResponse.redirect(new URL(next, request.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              redirectResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Save preferred_language for OAuth users whose profile has none yet.
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (createAdminClient() as any)
          .from("profiles")
          .update({ preferred_language: lang })
          .eq("id", user.id)
          .is("preferred_language", null);
      }
      return redirectResponse;
    }
  }

  return NextResponse.redirect(
    new URL(`/${lang}/login?error=auth_callback`, request.url)
  );
}
