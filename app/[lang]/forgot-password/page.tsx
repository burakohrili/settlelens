"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = useTranslations("forgot_password");
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${lang}/reset-password`,
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6">
      <div className="w-full max-w-sm">
        <Link href={`/${lang}`} className="font-display text-xl font-semibold text-[var(--gold)]">
          SettleLens
        </Link>

        {sent ? (
          <div className="mt-8 text-center">
            <CheckCircle2 size={40} className="mx-auto text-[var(--gain)]" />
            <h1 className="mt-4 font-display text-xl font-semibold text-[var(--navy)]">
              {t("sentTitle")}
            </h1>
            <p className="mt-2 font-ui text-sm text-[var(--brown)]">
              {t("sentMsg", { email })}
            </p>
            <Link
              href={`/${lang}/login`}
              className={cn(buttonVariants({ variant: "outline" }), "mt-6 border-[var(--sand)]")}
            >
              {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mt-8 font-display text-2xl font-semibold text-[var(--navy)]">
              {t("title")}
            </h1>
            <p className="mt-1 font-ui text-sm text-[var(--brown)]">
              {t("subtitle")}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={cn(buttonVariants(), "w-full bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
              >
                {loading ? t("sending") : t("submit")}
              </button>
            </form>
            <p className="mt-4 text-center font-ui text-sm">
              <Link href={`/${lang}/login`} className="text-[var(--gold)] hover:underline">
                {t("backToLogin")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
