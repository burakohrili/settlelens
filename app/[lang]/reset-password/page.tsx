"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const params = useParams();
  const lang = params.lang as string;
  const t = useTranslations("reset_password");
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("errMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("errTooShort"));
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.push(`/${lang}/login`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6">
      <div className="w-full max-w-sm">
        <Link href={`/${lang}`} className="font-display text-xl font-semibold text-[var(--gold)]">
          SettleLens
        </Link>
        <h1 className="mt-8 font-display text-2xl font-semibold text-[var(--navy)]">
          {t("title")}
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="password">{t("newPasswordLabel")}</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirm">{t("confirmLabel")}</Label>
            <Input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1"
            />
          </div>
          {error && <p role="alert" className="font-ui text-sm text-[var(--danger)]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={cn(buttonVariants(), "w-full bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
          >
            {loading ? t("saving") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
