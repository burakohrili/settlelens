import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const { email, name, country, language } = parsed.data;
  const supabase = await createClient();

  const { error } = await (supabase as never as {
    from: (t: string) => { insert: (d: unknown) => Promise<{ error: { code?: string } | null }> }
  }).from("waitlist").insert({ email, name: name ?? null, country: country ?? null, language: language ?? null });

  if (error) {
    if (error.code === "23505") {
      return Response.json({ duplicate: true, message: "You're already on the list." });
    }
    return Response.json({ error: "Could not join waitlist. Please try again." }, { status: 500 });
  }

  return Response.json({ success: true, message: "You're on the list. We'll be in touch." });
}
