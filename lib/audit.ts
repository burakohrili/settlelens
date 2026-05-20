type AuditEntry = {
  user_id?: string;
  action: string;
  metadata?: Record<string, unknown>;
  user_visible?: boolean;
  display_text?: string;
};

type InsertResult = { error: { code?: string; message: string } | null };
type AuditClient = {
  from: (table: string) => { insert: (data: unknown) => Promise<InsertResult> };
};

function maskUserId(uid: string | undefined): string {
  if (!uid) return "none";
  return `${uid.slice(0, 8)}...`;
}

// immediate + 1 retry after 150ms — never throws, audit failure must not break primary response
export async function writeAuditLog(
  supabase: unknown,
  entry: AuditEntry,
  context: string
): Promise<void> {
  const client = supabase as unknown as AuditClient;
  const delays = [0, 150];
  let lastErr: { code?: string; message?: string } | null = null;

  for (const delay of delays) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    const { error } = await client.from("audit_log").insert(entry);
    if (!error) return;
    lastErr = error;
  }

  console.error("[audit] audit_write_failed", {
    context,
    action: entry.action,
    user_id_masked: maskUserId(entry.user_id),
    error_code: lastErr?.code ?? "unknown",
    error_message: lastErr?.message ?? "unknown",
    timestamp: new Date().toISOString(),
  });
}
