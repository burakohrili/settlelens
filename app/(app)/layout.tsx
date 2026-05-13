import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Disclaimer } from "@/components/layout/Disclaimer";

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
    redirect("/en/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("name, plan_type, preferred_language")
    .eq("id", user.id)
    .single() as { data: { name?: string; plan_type?: string; preferred_language?: string } | null };

  const planType = profile?.plan_type ?? "discovery";
  const userName = profile?.name ?? "";
  const rawLang = profile?.preferred_language;
  const locale = (rawLang ?? "en") as string;
  setRequestLocale(locale);
  // Load messages directly — bypass getMessages() cache layer
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>;
  } catch {
    messages = (await import(`../../messages/en.json`)).default as Record<string, unknown>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
    <div className="flex min-h-screen flex-col">
      {/* DEBUG: remove after confirming locale works */}
      <div style={{background:"#e11d48",color:"#fff",textAlign:"center",fontSize:"11px",padding:"2px"}}>
        locale={locale} | rawLang={rawLang ?? "null"}
      </div>
      <AppHeader
        userEmail={user.email ?? ""}
        userName={userName}
        planType={planType}
        locale={locale}
      />
      <div className="flex flex-1">
        <AppSidebar planType={planType} locale={locale} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <Disclaimer className="mb-4" />
            {children}
          </div>
        </main>
      </div>
    </div>
    </NextIntlClientProvider>
  );
}
