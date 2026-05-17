import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function strip(s: string) {
  return String(s).replace(/[<>"']/g, "").replace(/[\r\n]/g, " ").slice(0, 2000);
}

export async function POST(req: Request) {
  try {
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

    await sendEmail({ type: "contact", from: email, name, subject, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
