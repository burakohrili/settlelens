import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, preferred_language, country, state_province } = body;

    // Verify caller identity via session cookie
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[update-profile] auth error:", authError?.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin as any)
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email ?? "",
          name: name ?? "",
          preferred_language: preferred_language ?? "en",
          country: country ?? null,
          state_province: state_province ?? null,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("[update-profile] upsert error:", error.code, error.message);
      return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[update-profile] unexpected error:", msg);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
