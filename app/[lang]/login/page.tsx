"use client";

import { useState } from "react";
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
import { CheckCircle2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const t = useTranslations("auth");
  const params = useParams();
  const lang = params.lang as string;
  const supabase = createClient();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setServerError(t("invalidCredentials"));
      setLoading(false);
      return;
    }
    // Hard navigation: clears Next.js server cache so (app)/layout.tsx sees the new session cookie
    window.location.href = `/${lang}/dashboard`;
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/${lang}/auth/callback` },
    });
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
            "{t("loginQuote")}"
          </p>
          <p className="mt-2 font-ui text-xs text-[var(--sand)]">{t("loginQuoteSub")}</p>
          <ul className="mt-8 space-y-4">
            {[t("loginBullet1"), t("loginBullet2"), t("loginBullet3")].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--gold)]" />
                <span className="font-body text-sm text-[var(--cream)]/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-ui text-xs text-[var(--brown)]">
            © 2026 SettleLens. {t("loginQuoteSub")}
          </p>
          <LanguageSwitcher variant="dark" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[var(--cream)] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between lg:hidden">
            <Link href={`/${lang}`} className="font-display text-lg font-semibold text-[var(--gold)]">
              SettleLens
            </Link>
            <LanguageSwitcher variant="light" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--navy)] lg:mt-0">
            {t("loginTitle")}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 font-ui text-xs text-[var(--danger)]">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link
                  href={`/${lang}/forgot-password`}
                  className="font-ui text-xs text-[var(--gold)] hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-1"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 font-ui text-xs text-[var(--danger)]">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p role="alert" aria-live="polite" className="font-ui text-sm text-[var(--danger)]">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(buttonVariants(), "w-full bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
            >
              {loading ? t("signingIn") : t("loginCta")}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--sand)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--cream)] px-2 font-ui text-xs text-[var(--brown)]">{t("or")}</span>
            </div>
          </div>

          <button
            onClick={signInWithGoogle}
            className={cn(buttonVariants({ variant: "outline" }), "w-full border-[var(--sand)] font-ui")}
          >
            <span dir="ltr" className="flex items-center justify-center gap-2 w-full">
              <span className="text-base font-bold">G</span>
              <span>{t("googleCta")}</span>
            </span>
          </button>

          <p className="mt-6 text-center font-ui text-sm text-[var(--brown)]">
            {t("switchToRegister")}{" "}
            <Link href={`/${lang}/register`} className="text-[var(--gold)] hover:underline font-semibold">
              {t("registerCta")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
