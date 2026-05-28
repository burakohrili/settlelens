import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PostHogProvider } from "@/components/layout/PostHogProvider";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { QuickExit } from "@/components/layout/QuickExit";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "meta" });
  return {
    title: `${t("siteName")} — ${t("tagline")}`,
    description: t("description"),
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) notFound();

  const messages = await getMessages();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M6LRP7BB');`,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V6D0B14RE1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-V6D0B14RE1');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M6LRP7BB" height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <PostHogProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <CookieBanner />
            <QuickExit />
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
