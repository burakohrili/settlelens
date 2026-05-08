import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  type QueryResult<T> = { data: T[] | null };
  type SingleResult<T> = { data: T | null };

  const db = supabase as unknown as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          single?: () => Promise<SingleResult<Record<string, unknown>>>;
        } & Promise<QueryResult<Record<string, unknown>>>;
      };
    };
  };

  const [
    profileResult,
    assetsResult,
    debtsResult,
    incomeResult,
    childrenResult,
    scenariosResult,
    analysesResult,
  ] = await Promise.all([
    (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => {
              single: () => Promise<{
                data: Record<string, unknown> | null;
              }>;
            };
          };
        };
      }
    )
      .from("profiles")
      .select("id,name,email,country,plan_type,created_at,preferred_language,onboarding_completed")
      .eq("id", user.id)
      .single(),
    (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => Promise<{
              data: Record<string, unknown>[] | null;
            }>;
          };
        };
      }
    )
      .from("assets")
      .select("*")
      .eq("user_id", user.id),
    (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => Promise<{
              data: Record<string, unknown>[] | null;
            }>;
          };
        };
      }
    )
      .from("debts")
      .select("*")
      .eq("user_id", user.id),
    (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => Promise<{
              data: Record<string, unknown>[] | null;
            }>;
          };
        };
      }
    )
      .from("income")
      .select("*")
      .eq("user_id", user.id),
    (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => Promise<{
              data: Record<string, unknown>[] | null;
            }>;
          };
        };
      }
    )
      .from("children")
      .select("*")
      .eq("user_id", user.id),
    (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => Promise<{
              data: Record<string, unknown>[] | null;
            }>;
          };
        };
      }
    )
      .from("scenarios")
      .select("*")
      .eq("user_id", user.id),
    (
      supabase as unknown as {
        from: (t: string) => {
          select: (s: string) => {
            eq: (c: string, v: string) => Promise<{
              data: Record<string, unknown>[] | null;
            }>;
          };
        };
      }
    )
      .from("analyses")
      .select("id,scenario_id,jurisdiction,net_worth_now,net_worth_year1,net_worth_year3,net_worth_year5,net_worth_year10,monthly_cash_flow,risk_score,confidence_label,created_at")
      .eq("user_id", user.id),
  ]);

  await (
    supabase as unknown as {
      from: (t: string) => {
        insert: (d: unknown) => Promise<unknown>;
      };
    }
  )
    .from("audit_log")
    .insert({
      user_id: user.id,
      action: "data_exported",
      user_visible: true,
      display_text: "Your data was exported",
    });

  const exportData = {
    exported_at: new Date().toISOString(),
    note: "SettleLens GDPR data export — Article 20 Right to Data Portability",
    profile: profileResult.data,
    assets: assetsResult.data ?? [],
    debts: debtsResult.data ?? [],
    income: incomeResult.data ?? [],
    children: childrenResult.data ?? [],
    scenarios: scenariosResult.data ?? [],
    analyses: analysesResult.data ?? [],
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition":
        'attachment; filename="settlelens-data-export.json"',
    },
  });
}
