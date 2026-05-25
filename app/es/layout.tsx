import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/es.json";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="es" messages={messages}>
          {children}
        </NextIntlClientProvider>
        <GoogleAnalytics gaId="G-V6D0B14RE1" />
      </body>
    </html>
  );
}
