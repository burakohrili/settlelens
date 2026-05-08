import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function requireUser(lang = "en") {
  const { user } = await getUser();
  if (!user) redirect(`/${lang}/login`);
  return user;
}
