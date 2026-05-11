"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LogOut, Settings, User, CreditCard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  userEmail?: string;
  userName?: string;
  planType?: string;
  locale?: string;
};

export function AppHeader({ userEmail = "", userName = "", planType = "discovery", locale = "en" }: Props) {
  const t = useTranslations("nav");
  const router = useRouter();
  const supabase = createClient();

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : userEmail.slice(0, 2).toUpperCase();

  const isPaid = planType !== "discovery";

  async function signOut() {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--sand)] bg-[var(--cream)] px-4 sm:px-6">
      <Link
        href={`/${locale}`}
        className="font-display text-lg font-semibold text-[var(--navy)]"
      >
        SettleLens
      </Link>

      <div className="flex items-center gap-2">
        {!isPaid && (
          <Link
            href="/upgrade"
            className={cn(buttonVariants({ size: "sm" }), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
          >
            {t("upgrade")}
          </Link>
        )}

        {isPaid && (
          <Badge
            variant="outline"
            className="border-[var(--gold)] text-[var(--gold)] font-ui text-xs uppercase"
          >
            {planType}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[var(--slate)] text-[var(--cream)] text-xs font-ui">
                {initials}
              </AvatarFallback>
            </Avatar>
            <ChevronDown size={14} className="text-[var(--brown)]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => router.push("/settings")} className="flex items-center gap-2 cursor-pointer">
              <User size={14} /> {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/billing")} className="flex items-center gap-2 cursor-pointer">
              <CreditCard size={14} /> {t("billing")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")} className="flex items-center gap-2 cursor-pointer">
              <Settings size={14} /> {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="flex items-center gap-2 cursor-pointer text-[var(--danger)]"
            >
              <LogOut size={14} /> {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
