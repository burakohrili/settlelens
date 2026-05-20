import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await (supabase as never as {
      from: (t: string) => { select: (s: string) => { limit: (n: number) => Promise<{ error: unknown }> } }
    }).from("profiles").select("count").limit(1);
    if (error) return Response.json({ status: "error" }, { status: 500 });
    return Response.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch {
    return Response.json({ status: "error" }, { status: 500 });
  }
}
