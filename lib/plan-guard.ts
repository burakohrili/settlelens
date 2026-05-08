import { createClient } from "@/lib/supabase/server";

export const PLAN_LIMITS = {
  discovery: {
    analyses: 0,
    scenarios: 0,
    pdf_reports: 0,
    lawyer_export: false,
    crypto_assets: true,
    projection_years: 0,
  },
  clarified: {
    analyses: 1,
    scenarios: 1,
    pdf_reports: 1,
    lawyer_export: false,
    crypto_assets: true,
    projection_years: 10,
    expires_days: 14,
  },
  strategist: {
    analyses: -1,
    scenarios: -1,
    pdf_reports: -1,
    lawyer_export: false,
    crypto_assets: true,
    projection_years: 10,
    inflation_scenarios: true,
  },
  professional: {
    analyses: -1,
    scenarios: -1,
    pdf_reports: -1,
    lawyer_export: true,
    crypto_assets: true,
    projection_years: 10,
    inflation_scenarios: true,
    evidence_organizer: true,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export async function checkPlanAccess(
  userId: string,
  feature: keyof (typeof PLAN_LIMITS)[PlanType]
): Promise<boolean | number> {
  const supabase = await createClient();
  const { data: profile } = await (supabase as never as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          single: () => Promise<{ data: { plan_type: string; plan_expires_at: string | null } | null }>;
        };
      };
    };
  })
    .from("profiles")
    .select("plan_type,plan_expires_at")
    .eq("id", userId)
    .single();

  if (!profile) return false;

  let planType = (profile.plan_type as PlanType) ?? "discovery";

  // Check clarified plan expiry
  if (planType === "clarified" && profile.plan_expires_at) {
    if (new Date(profile.plan_expires_at) < new Date()) {
      await (supabase as never as {
        from: (t: string) => {
          update: (d: unknown) => { eq: (c: string, v: string) => Promise<unknown> };
        };
      })
        .from("profiles")
        .update({ plan_type: "discovery" })
        .eq("id", userId);
      planType = "discovery";
    }
  }

  const limits = PLAN_LIMITS[planType];
  return (limits as Record<string, boolean | number>)[feature as string] ?? false;
}
