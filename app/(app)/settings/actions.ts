"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function updateProfile(data: {
  name: string;
  preferred_language: string;
  country: string | null;
  state_province: string | null;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (createAdminClient() as any)
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        name: data.name ?? "",
        preferred_language: data.preferred_language ?? "en",
        country: data.country ?? null,
        state_province: data.state_province ?? null,
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("[updateProfile] upsert error:", error.code, error.message);
    throw new Error(error.message);
  }
}
