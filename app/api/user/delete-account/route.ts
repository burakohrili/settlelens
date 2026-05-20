import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { confirmation?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.confirmation !== "DELETE") {
    return Response.json(
      { error: "Confirmation required. Send { confirmation: 'DELETE' }." },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  // Revoke session first — prevents any in-flight requests after account deletion starts
  await (
    adminClient as unknown as {
      auth: {
        admin: {
          signOut: (uid: string) => Promise<unknown>;
        };
      };
    }
  ).auth.admin.signOut(user.id);

  // Soft-delete: set deleted_at — hard delete runs via pg_cron after 30 days
  await (
    adminClient as unknown as {
      from: (t: string) => {
        update: (d: unknown) => {
          eq: (c: string, v: string) => Promise<unknown>;
        };
      };
    }
  )
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", user.id);

  // Anonymized audit entry — no user_id so it survives after hard delete
  await (
    adminClient as unknown as {
      from: (t: string) => {
        insert: (d: unknown) => Promise<unknown>;
      };
    }
  )
    .from("audit_log")
    .insert({
      user_id: null,
      action: "account_deleted",
      metadata: { deleted_at: new Date().toISOString() },
      user_visible: false,
    });

  return Response.json({
    success: true,
    message:
      "Your account has been deactivated. All your financial data will be permanently deleted within 30 days. You can reactivate your account within this period by contacting support@settlelens.com.",
  });
}
