import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json() as { locale?: string };
  const locale = body.locale;
  if (!locale || !(VALID_LOCALES as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  await (supabase as unknown as {
    from: (t: string) => { update: (d: Record<string, string>) => { eq: (c: string, v: string) => Promise<unknown> } }
  }).from("profiles")
    .update({ preferred_language: locale })
    .eq("id", user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("SETTLELENS_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}
