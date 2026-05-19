import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function strip(s: string) {
  return String(s).replace(/[<>"']/g, "").replace(/[\r\n]/g, " ").slice(0, 2000);
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const adminClient = createAdminClient();
    const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
    const { count: recentContacts } = await adminClient
      .from("audit_log")
      .select("id", { count: "exact", head: true })
      .eq("action", "contact_form")
      .gte("created_at", oneHourAgo)
      .filter("metadata->>ip", "eq", ip);

    if ((recentContacts ?? 0) >= 3) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const name = strip(body.name ?? "");
    const email = strip(body.email ?? "");
    const subject = strip(body.subject ?? "");
    const message = strip(body.message ?? "");

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await adminClient.from("audit_log").insert({
      action: "contact_form",
      metadata: { ip, email: email.slice(0, 100), name: name.slice(0, 100) },
    });

    await sendEmail({ type: "contact", from: email, name, subject, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
