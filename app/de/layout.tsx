import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/de.json";

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="de" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
