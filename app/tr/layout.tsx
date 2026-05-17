import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/tr.json";

export default function TrLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="tr" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
