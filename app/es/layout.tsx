import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/es.json";

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="es" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
