import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AuditEntry = {
  action: string;
  display_text: string;
  created_at: string;
};

const ACTION_ICONS: Record<string, string> = {
  user_registered: "👤",
  analysis_completed: "📊",
  report_generated: "📄",
  data_exported: "⬇️",
  password_changed: "🔑",
  plan_upgraded: "⬆️",
  account_deleted: "🗑️",
};

export default async function SecurityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/en/login");

  const { data: logs } = await (
    supabase as unknown as {
      from: (t: string) => {
        select: (s: string) => {
          eq: (
            c: string,
            v: string
          ) => {
            eq: (
              c: string,
              v: boolean
            ) => {
              order: (
                c: string,
                o: { ascending: boolean }
              ) => {
                limit: (n: number) => Promise<{ data: AuditEntry[] | null }>;
              };
            };
          };
        };
      };
    }
  )
    .from("audit_log")
    .select("action,display_text,created_at")
    .eq("user_id", user.id)
    .eq("user_visible", true)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1
          className="text-2xl font-bold text-[#1C2B3A]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Security Log
        </h1>
        <p className="mt-1 text-sm text-[#8B7355]">
          A record of key actions on your account.
        </p>
      </div>

      {/* Trust statement */}
      <div className="rounded-xl border border-[#4FA86E] bg-green-50 p-5">
        <p className="text-sm font-semibold text-[#1C2B3A] mb-1">
          Your data is private.
        </p>
        <p className="text-sm text-[#2E4D6B]">
          No Anthropic employee, SettleLens team member, or third party has
          accessed your financial data. Only you can see your scenarios, assets,
          and reports.
        </p>
      </div>

      {/* Third-party access */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6">
        <h2 className="font-semibold text-[#1C2B3A] mb-3">
          Third-Party Access
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-[#4FA86E] font-medium">None</p>
        </div>
        <p className="mt-2 text-xs text-[#8B7355]">
          SettleLens does not share your financial data with any third parties.
          Payments are processed by Paddle (Paddle never sees your financial
          scenario data).
        </p>
      </div>

      {/* Activity log */}
      <div className="rounded-xl border border-[#D4C5B0] bg-white p-6">
        <h2 className="font-semibold text-[#1C2B3A] mb-4">
          Your Data Activity Log
        </h2>

        {!logs || logs.length === 0 ? (
          <p className="text-sm text-[#8B7355]">
            No account activity recorded yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {logs.map((entry, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-base">
                  {ACTION_ICONS[entry.action] ?? "📌"}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-[#1C2B3A]">
                    {entry.display_text || entry.action}
                  </p>
                  <p className="text-xs text-[#8B7355]">
                    {new Date(entry.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-[#8B7355]">
        This log shows key account events. Detailed server access logs are
        retained for security purposes and are not displayed here.
      </p>
    </div>
  );
}
