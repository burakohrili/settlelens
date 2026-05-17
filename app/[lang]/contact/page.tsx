"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Disclaimer } from "@/components/layout/Disclaimer";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
    setSent(true);
    setLoading(false);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-[var(--navy)]">
          {t("title")}
        </h1>
        <Disclaimer className="mt-4" />

        <div className="mt-6 rounded-lg border border-[var(--sand)] bg-white p-6">
          {sent ? (
            <p className="font-ui text-[var(--gain)] font-semibold">
              {t("success")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" name="name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject">{t("subject")}</Label>
                <Input id="subject" name="subject" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">{t("message")}</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-ui text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={cn(buttonVariants(), "w-full bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90 font-semibold")}
              >
                {loading ? t("sending") : t("send")}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 font-ui text-sm text-[var(--brown)]">
          <p>support@settlelens.com</p>
          <p>privacy@settlelens.com</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
