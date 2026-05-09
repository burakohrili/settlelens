import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { to, name } = await req.json();
    if (!to) return NextResponse.json({ error: "Missing to" }, { status: 400 });
    await sendEmail({ type: "welcome", to, name });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
