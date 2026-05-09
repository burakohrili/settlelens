import { NextResponse } from "next/server";
export const runtime = "edge";
export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NOT_SET",
    hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
