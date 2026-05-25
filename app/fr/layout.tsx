import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/fr.json";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className="h-full antialiased">
      <GoogleTagManager gtmId="GTM-M6LRP7BB" />
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="fr" messages={messages}>
          {children}
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-V6D0B14RE1" />
      </body>
    </html>
  );
}
