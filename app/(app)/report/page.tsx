"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { Download, Loader2, Lock } from "lucide-react";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) ?? "en";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-report", { method: "POST" });
      const body = await res.json();

      if (!res.ok) {
        if (body.error === "upgrade_required") {
          router.push(`/${lang}/upgrade`);
          return;
        }
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (body.url) {
        setDone(true);
        window.open(body.url, "_blank");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--navy)]">Download Your Report</h1>
        <p className="font-ui text-sm text-[var(--brown)] mt-1">
          A comprehensive PDF financial overview — organized for your attorney or personal review.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--sand)] bg-white p-6 space-y-4">
        <h2 className="font-ui text-sm font-semibold text-[var(--navy)]">Report includes:</h2>
        <ul className="space-y-2">
          {[
            "Net worth summary — assets, debts, and equity",
            "Scenario comparison — all your settlement scenarios side by side",
            "10-year financial projection per scenario",
            "Alimony and child support estimate ranges",
            "Key risk factors identified by the analysis",
            "Financial positioning notes for negotiation preparation",
            "Jurisdiction methodology note",
            "Full legal disclaimer",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-ui text-sm text-[var(--brown)]">
              <span className="text-[var(--gold)] mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-md bg-[var(--cream)] border border-[var(--sand)] p-3">
          <p className="font-ui text-xs text-[var(--brown)]">
            <strong>Format:</strong> PDF · A4 · Watermarked "For personal planning use only"<br />
            <strong>Valid for:</strong> 24 hours (re-generate anytime)
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3">
            <p className="font-ui text-sm text-red-700">{error}</p>
          </div>
        )}

        {done ? (
          <div className="rounded-md bg-green-50 border border-green-200 p-3">
            <p className="font-ui text-sm text-green-700">
              Your report has opened in a new tab. If it didn&apos;t open, check your pop-up blocker.
            </p>
            <button
              onClick={handleGenerate}
              className={cn(buttonVariants({ variant: "outline" }), "mt-3 border-[var(--sand)] text-sm")}
            >
              <Download size={14} className="mr-1" /> Download again
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={cn(
              buttonVariants(),
              "w-full bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? (
              <><Loader2 size={16} className="mr-2 animate-spin" /> Generating your report…</>
            ) : (
              <><Download size={16} className="mr-2" /> Generate & Download PDF</>
            )}
          </button>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-md border border-[var(--sand)] bg-[var(--cream)] p-3">
        <Lock size={14} className="text-[var(--brown)] mt-0.5 flex-shrink-0" />
        <p className="font-ui text-xs text-[var(--brown)]">
          Your report is generated on demand and stored securely. Only you can access it. The link expires after 24 hours.
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
