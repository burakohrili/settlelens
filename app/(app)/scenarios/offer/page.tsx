"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

type OfferResult = {
  net_worth_now: number;
  year10: number;
  monthly_cashflow: number;
  risk_score: number;
  offer_vs_baseline_year10?: number;
  offer_assessment?: "favorable" | "neutral" | "unfavorable";
  key_differences?: string[];
  points_to_negotiate?: string[];
  questions_for_your_lawyer?: string[];
  offer_tone_note?: string;
  confidence_label_text?: string;
};

const OFFER_SOURCES = [
  { value: "spouse_direct", label: "From my spouse directly" },
  { value: "spouse_attorney", label: "From spouse's attorney" },
  { value: "mediator", label: "From a mediator" },
  { value: "other", label: "Other" },
];

const HOUSE_OPTIONS = [
  { value: "i_keep", label: "I keep the house" },
  { value: "spouse_keeps", label: "Spouse keeps the house" },
  { value: "sell", label: "We sell the house" },
  { value: "not_applicable", label: "No house / not applicable" },
];

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

export default function OfferPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) ?? "en";
  const supabase = createClient();

  const [offerSource, setOfferSource] = useState("spouse_direct");
  const [houseOutcome, setHouseOutcome] = useState("sell");
  const [alimonyMonthly, setAlimonyMonthly] = useState("");
  const [alimonyYears, setAlimonyYears] = useState("");
  const [alimonyDirection, setAlimonyDirection] = useState("i_receive");
  const [retirementSplit, setRetirementSplit] = useState("50");
  const [offerRawText, setOfferRawText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OfferResult | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/${lang}/login`); return; }

    // Create offer scenario
    const { data: scenario } = await (supabase as never as {
      from: (t: string) => {
        insert: (d: unknown) => {
          select: () => { single: () => Promise<{ data: Record<string, unknown> | null }> }
        }
      }
    }).from("scenarios").insert({
      user_id: user.id,
      name: `Offer from ${offerSource} — ${new Date().toLocaleDateString()}`,
      scenario_type: "offer_comparison",
      house_outcome: houseOutcome,
      retirement_split_me: parseFloat(retirementSplit) || 50,
      alimony_monthly: parseFloat(alimonyMonthly) || 0,
      alimony_years: parseInt(alimonyYears) || 0,
      alimony_direction: alimonyDirection,
      child_support_monthly: 0,
      child_support_direction: "i_receive",
      offer_source: offerSource,
      offer_raw_text: offerRawText,
      offer_entered_at: new Date().toISOString(),
      is_active: true,
    }).select().single();

    if (!scenario?.id) {
      setError("Could not save offer scenario. Please try again.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId: scenario.id }),
    });

    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Analysis failed. Please try again.");
      setLoading(false);
      return;
    }

    setResult(body.data);
    setLoading(false);
  }

  const assessmentIcon = result?.offer_assessment === "favorable"
    ? <TrendingUp size={20} className="text-[var(--gain)]" />
    : result?.offer_assessment === "unfavorable"
    ? <TrendingDown size={20} className="text-[var(--danger)]" />
    : <Minus size={20} className="text-[var(--gold)]" />;

  const assessmentColor = result?.offer_assessment === "favorable"
    ? "text-[var(--gain)]"
    : result?.offer_assessment === "unfavorable"
    ? "text-[var(--danger)]"
    : "text-[var(--gold)]";

  const assessmentLabel = {
    favorable: "This offer projects a stronger financial outcome than your baseline",
    neutral: "This offer projects a similar financial outcome to your baseline",
    unfavorable: "This offer projects a weaker financial outcome than your baseline",
  }[result?.offer_assessment ?? "neutral"];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--navy)]">Analyze an Offer</h1>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">
          Enter the terms of a settlement offer to see its projected 10-year financial impact.
        </p>
      </div>

      {!result ? (
        <div className="rounded-xl border border-[var(--sand)] bg-white p-5 space-y-4">
          <div>
            <Label>Offer source</Label>
            <select value={offerSource} onChange={(e) => setOfferSource(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {OFFER_SOURCES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <Label>House / property outcome</Label>
            <select value={houseOutcome} onChange={(e) => setHouseOutcome(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {HOUSE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <Label>My retirement / investment share (%)</Label>
            <Input type="number" min={0} max={100} value={retirementSplit} onChange={(e) => setRetirementSplit(e.target.value)} className="mt-1" placeholder="50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Alimony / spousal support ($/mo)</Label>
              <Input type="number" min={0} value={alimonyMonthly} onChange={(e) => setAlimonyMonthly(e.target.value)} className="mt-1" placeholder="0" />
            </div>
            <div>
              <Label>Duration (years)</Label>
              <Input type="number" min={0} max={30} value={alimonyYears} onChange={(e) => setAlimonyYears(e.target.value)} className="mt-1" placeholder="0" />
            </div>
            <div className="col-span-2">
              <Label>Direction</Label>
              <select value={alimonyDirection} onChange={(e) => setAlimonyDirection(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="i_receive">I receive</option>
                <option value="i_pay">I pay</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Additional offer details <span className="text-[var(--brown)] font-normal">(optional — in your own words)</span></Label>
            <textarea
              value={offerRawText}
              onChange={(e) => setOfferRawText(e.target.value)}
              rows={3}
              placeholder="e.g. Spouse also proposes keeping the car, paying off the joint credit card..."
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="font-ui text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={cn(
              buttonVariants(),
              "w-full bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Analyzing offer…</> : "Analyze This Offer →"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Assessment banner */}
          <div className={cn("rounded-xl border p-5 flex items-start gap-3",
            result.offer_assessment === "favorable" ? "border-[var(--gain)] bg-green-50"
            : result.offer_assessment === "unfavorable" ? "border-[var(--danger)] bg-red-50"
            : "border-[var(--gold)] bg-amber-50"
          )}>
            {assessmentIcon}
            <div>
              <p className={cn("font-ui font-semibold text-base", assessmentColor)}>{assessmentLabel}</p>
              {result.offer_vs_baseline_year10 !== undefined && (
                <p className="font-mono text-sm mt-1 text-[var(--brown)]">
                  10-year difference: <strong className={assessmentColor}>{fmt(result.offer_vs_baseline_year10)}</strong> vs. your baseline
                </p>
              )}
              {result.offer_tone_note && (
                <p className="font-ui text-sm mt-2 text-[var(--brown)] italic">{result.offer_tone_note}</p>
              )}
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-[var(--sand)] bg-white p-3 text-center">
              <p className="font-ui text-xs text-[var(--brown)] uppercase">Net Worth Now</p>
              <p className="font-mono text-base font-bold text-[var(--navy)] mt-1">{fmt(result.net_worth_now)}</p>
            </div>
            <div className="rounded-lg border border-[var(--sand)] bg-white p-3 text-center">
              <p className="font-ui text-xs text-[var(--brown)] uppercase">Year 10</p>
              <p className="font-mono text-base font-bold text-[var(--gold)] mt-1">{fmt(result.year10)}</p>
            </div>
            <div className="rounded-lg border border-[var(--sand)] bg-white p-3 text-center">
              <p className="font-ui text-xs text-[var(--brown)] uppercase">Risk Score</p>
              <p className={cn("font-mono text-base font-bold mt-1", result.risk_score >= 7 ? "text-[var(--danger)]" : result.risk_score >= 4 ? "text-[var(--gold)]" : "text-[var(--gain)]")}>
                {result.risk_score}/10
              </p>
            </div>
          </div>

          {/* Key differences */}
          {result.key_differences && result.key_differences.length > 0 && (
            <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
              <h3 className="font-ui text-sm font-semibold text-[var(--navy)] mb-3">Key differences from your baseline</h3>
              <ul className="space-y-1.5">
                {result.key_differences.map((d, i) => (
                  <li key={i} className="font-ui text-sm text-[var(--brown)] flex items-start gap-2">
                    <span className="text-[var(--navy)] mt-0.5">•</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Points to discuss */}
          {result.points_to_negotiate && result.points_to_negotiate.length > 0 && (
            <div className="rounded-xl border border-[var(--sand)] bg-white p-4">
              <h3 className="font-ui text-sm font-semibold text-[var(--navy)] mb-3">Points you may want to discuss</h3>
              <ul className="space-y-1.5">
                {result.points_to_negotiate.map((p, i) => (
                  <li key={i} className="font-ui text-sm text-[var(--brown)] flex items-start gap-2">
                    <span className="text-[var(--gold)] mt-0.5">→</span><span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Questions for lawyer */}
          {result.questions_for_your_lawyer && result.questions_for_your_lawyer.length > 0 && (
            <div className="rounded-xl border border-[var(--navy)] bg-[var(--navy)]/5 p-4">
              <h3 className="font-ui text-sm font-semibold text-[var(--navy)] mb-3">Questions to raise with your attorney</h3>
              <ul className="space-y-2">
                {result.questions_for_your_lawyer.map((q, i) => (
                  <li key={i} className="font-ui text-sm text-[var(--navy)] flex items-start gap-2">
                    <span className="font-bold">{i + 1}.</span><span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.confidence_label_text && (
            <p className="font-ui text-xs text-[var(--brown)] italic">{result.confidence_label_text}</p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setResult(null)} className={cn(buttonVariants({ variant: "outline" }), "border-[var(--sand)]")}>
              Analyze another offer
            </button>
            <a href={`/${lang}/dashboard`} className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}>
              Back to dashboard
            </a>
          </div>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
