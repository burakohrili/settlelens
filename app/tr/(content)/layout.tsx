import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function TrContentLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextIntlClientProvider>
  );
}
