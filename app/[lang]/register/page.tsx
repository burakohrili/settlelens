"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConsentCheckboxes } from "@/components/forms/ConsentCheckboxes";
import { CheckCircle2 } from "lucide-react";

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirm: z.string(),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });
type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["bg-[var(--danger)]", "bg-orange-400", "bg-yellow-400", "bg-[var(--gain)]"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? colors[score - 1] : "bg-[var(--sand)]")}
          />
        ))}
      </div>
      <p className="mt-0.5 font-ui text-xs text-[var(--brown)]">{labels[score - 1] ?? ""}</p>
    </div>
  );
}

export default function RegisterPage() {
  const t = useTranslations("auth");
  const params = useParams();
  const lang = params.lang as string;
  const supabase = createClient();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [consentValid, setConsentValid] = useState(false);
  const [consentState, setConsentState] = useState({ terms: false, data: false, kvkk: false, marketing: false });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password", "");

  const handleConsent = useCallback(
    (valid: boolean, state: typeof consentState) => {
      setConsentValid(valid);
      setConsentState(state);
    },
    []
  );

  async function onSubmit(data: FormData) {
    if (!consentValid) return;
    setLoading(true);
    setServerError("");

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (userId) {
      await (supabase as never as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
        .from("profiles").insert({
          id: userId,
          email: data.email,
          name: data.name,
          preferred_language: lang,
          gdpr_consent: true,
          gdpr_consent_at: new Date().toISOString(),
          kvkk_consent: lang === "tr" ? consentState.kvkk : false,
          kvkk_consent_at: lang === "tr" && consentState.kvkk ? new Date().toISOString() : null,
          marketing_consent: consentState.marketing,
        });

      await (supabase as never as { from: (t: string) => { insert: (d: unknown) => Promise<unknown> } })
        .from("audit_log").insert({
          user_id: userId,
          action: "user_registered",
          metadata: { lang },
        });
    }

    // Welcome email via API route (server-side Resend, fire and forget)
    fetch("/api/email/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: data.email, name: data.name }),
    }).catch(() => {});

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6">
        <div className="max-w-sm text-center">
          <CheckCircle2 size={48} className="mx-auto text-[var(--gain)]" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--navy)]">
            Check your email
          </h1>
          <p className="mt-2 font-ui text-sm text-[var(--brown)]">
            We sent a confirmation link to your email. Please verify before signing in.
          </p>
          <Link
            href={`/${lang}/login`}
            className={cn(buttonVariants(), "mt-6 bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden flex-col justify-between bg-[var(--navy)] px-12 py-16 lg:flex lg:w-3/5">
        <Link href={`/${lang}`} className="font-display text-xl font-semibold text-[var(--gold)]">
          SettleLens
        </Link>
        <div>
          <p className="font-display text-4xl font-semibold italic leading-tight text-[var(--cream)]">
            "Financial clarity before you negotiate."
          </p>
          <p className="mt-2 font-ui text-xs text-[var(--sand)]">Financial modeling, not legal advice.</p>
          <ul className="mt-8 space-y-4">
            {[
              "Takes 20 minutes to complete",
              "Your data is private — only you can see it",
              "Download a PDF report for your attorney",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--gold)]" />
                <span className="font-body text-sm text-[var(--cream)]/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="font-ui text-xs text-[var(--brown)]">© 2026 SettleLens.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[var(--cream)] px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href={`/${lang}`} className="font-display text-lg font-semibold text-[var(--gold)] lg:hidden">
            SettleLens
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--navy)] lg:mt-0">
            {t("registerTitle")}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" autoComplete="name" className="mt-1" {...register("name")} />
              {errors.name && <p className="mt-1 font-ui text-xs text-[var(--danger)]">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" autoComplete="email" className="mt-1" {...register("email")} />
              {errors.email && <p className="mt-1 font-ui text-xs text-[var(--danger)]">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" autoComplete="new-password" className="mt-1" {...register("password")} />
              <PasswordStrength password={password} />
              {errors.password && <p className="mt-1 font-ui text-xs text-[var(--danger)]">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="password_confirm">Confirm password</Label>
              <Input id="password_confirm" type="password" autoComplete="new-password" className="mt-1" {...register("password_confirm")} />
              {errors.password_confirm && <p className="mt-1 font-ui text-xs text-[var(--danger)]">{errors.password_confirm.message}</p>}
            </div>

            <div className="rounded-md border border-[var(--sand)] bg-white p-3">
              <ConsentCheckboxes onValid={handleConsent} />
            </div>

            {serverError && <p className="font-ui text-sm text-[var(--danger)]">{serverError}</p>}

            <button
              type="submit"
              disabled={loading || !consentValid}
              className={cn(
                buttonVariants(),
                "w-full bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90",
                (!consentValid) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? "Creating account…" : t("registerCta")}
            </button>
          </form>

          <p className="mt-6 text-center font-ui text-sm text-[var(--brown)]">
            {t("switchToLogin")}{" "}
            <Link href={`/${lang}/login`} className="text-[var(--gold)] hover:underline font-semibold">
              {t("loginCta")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
