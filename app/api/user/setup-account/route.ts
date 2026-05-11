import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, email, name, lang, kvkkConsent, marketingConsent } = body;

  if (!userId || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify the caller is actually this user (not a spoofed request)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role to bypass RLS — safe because we verified identity above
  const admin = createAdminClient();

  const { error: profileError } = await (admin as never as {
    from: (t: string) => { upsert: (d: unknown, opts: unknown) => Promise<{ error: unknown }> }
  }).from("profiles").upsert({
    id: userId,
    email,
    name: name ?? "",
    preferred_language: lang ?? "en",
    gdpr_consent: true,
    gdpr_consent_at: new Date().toISOString(),
    kvkk_consent: lang === "tr" ? (kvkkConsent ?? false) : false,
    kvkk_consent_at: lang === "tr" && kvkkConsent ? new Date().toISOString() : null,
    marketing_consent: marketingConsent ?? false,
  }, { onConflict: "id" });

  if (profileError) {
    console.error("[setup-account] profile upsert error:", profileError);
    return NextResponse.json({ error: "Profile creation failed" }, { status: 500 });
  }

  await (admin as never as {
    from: (t: string) => { insert: (d: unknown) => Promise<unknown> }
  }).from("audit_log").insert({
    user_id: userId,
    action: "user_registered",
    user_visible: true,
    display_text: "Account created",
    metadata: { lang },
  });

  return NextResponse.json({ ok: true });
}
