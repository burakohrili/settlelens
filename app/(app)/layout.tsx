import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { QuickExit } from "@/components/layout/QuickExit";
import { LocaleSync } from "@/components/app/LocaleSync";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const cookieStore = await cookies();
    const lang =
      cookieStore.get("SETTLELENS_LOCALE")?.value ??
      cookieStore.get("NEXT_LOCALE")?.value;
    const validLocales = ["en", "tr", "de", "fr", "es", "ar"];
    const loginLocale = lang && validLocales.includes(lang) ? lang : "en";
    redirect(`/${loginLocale}/login`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("name, plan_type, preferred_language, onboarding_completed")
    .eq("id", user.id)
    .single() as { data: { name?: string; plan_type?: string; preferred_language?: string; onboarding_completed?: boolean } | null };

  const planType = profile?.plan_type ?? "discovery";
  const userName = profile?.name ?? "";
  const rawLang = profile?.preferred_language;

  // Fall back to the NEXT_LOCALE cookie set by next-intl middleware when the user
  // visited a localized page (e.g. /tr/login). This covers existing users whose
  // preferred_language is still null, and new OAuth users before their first save.
  const cookieStore = await cookies();
  const cookieLang =
    cookieStore.get("SETTLELENS_LOCALE")?.value ??
    cookieStore.get("NEXT_LOCALE")?.value;
  const validLocales = ["en", "tr", "de", "fr", "es", "ar"];
  const locale = (
    (rawLang && validLocales.includes(rawLang) ? rawLang : null) ??
    (cookieLang && validLocales.includes(cookieLang) ? cookieLang : null) ??
    "en"
  ) as string;

  // Redirect to onboarding if not completed — skip when already on an onboarding path
  // to avoid an infinite redirect loop.
  if (!profile?.onboarding_completed) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") ?? "";
    if (!pathname.includes("/onboarding/")) {
      redirect(`/${locale}/onboarding/step-1`);
    }
  }

  // Persist detected locale to DB so future loads don't need the cookie fallback.
  if (!rawLang && cookieLang && validLocales.includes(cookieLang)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("profiles")
      .update({ preferred_language: cookieLang })
      .eq("id", user.id)
      .is("preferred_language", null);
  }

  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "nav" });
  // Load messages directly — bypass getMessages() cache layer
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>;
  } catch {
    messages = (await import(`../../messages/en.json`)).default as Record<string, unknown>;
  }

  const isOnboarding = !profile?.onboarding_completed;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSync locale={locale} />
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--navy)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--cream)] focus:outline-none"
      >
        {tNav("skipLink")}
      </a>
      <AppHeader
        userEmail={user.email ?? ""}
        userName={userName}
        planType={planType}
        locale={locale}
      />
      <div className="flex flex-1">
        {!isOnboarding && <AppSidebar planType={planType} locale={locale} />}
        <main id="main-content" className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <Disclaimer className="mb-4" />
            {children}
          </div>
        </main>
      </div>
    </div>
      <QuickExit />
    </NextIntlClientProvider>
  );
}
