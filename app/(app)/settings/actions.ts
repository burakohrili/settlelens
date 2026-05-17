"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function updateProfile(data: {
  name: string;
  preferred_language: string;
  country: string | null;
  state_province: string | null;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  // Use upsert so the profile row is created if it doesn't exist yet.
  // The profiles table requires id + email at minimum.
  const { error } = await admin
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? "",
      name: data.name ?? "",
      preferred_language: data.preferred_language ?? "en",
      country: data.country as "US" | "UK" | "DE" | "FR" | "ES" | "TR" | null ?? null,
      state_province: data.state_province ?? null,
    }, { onConflict: "id" });

  if (error) {
    console.error("[updateProfile] error:", error.code, error.message);
    throw new Error(error.message);
  }

  // Persist the resolved locale so (app) server pages can read it
  // via i18n.ts when requestLocale is null (no locale in URL).
  const cookieStore = await cookies();
  cookieStore.set("SETTLELENS_LOCALE", data.preferred_language ?? "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
