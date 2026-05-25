import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/de.json";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" dir="ltr" className="h-full antialiased">
      <GoogleTagManager gtmId="GTM-M6LRP7BB" />
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="de" messages={messages}>
          {children}
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-V6D0B14RE1" />
      </body>
    </html>
  );
}
