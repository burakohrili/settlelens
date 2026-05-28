import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="en" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
