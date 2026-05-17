import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/fr.json";

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="fr" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
