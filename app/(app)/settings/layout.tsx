"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { User, CreditCard, Shield, Lock, Bell } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("settings");
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}/settings`, label: t("navAccount"), icon: User, exact: true },
    { href: `/${locale}/settings/billing`, label: t("navBilling"), icon: CreditCard, exact: false },
    { href: `/${locale}/settings/privacy`, label: t("navPrivacy"), icon: Shield, exact: false },
    { href: `/${locale}/settings/security`, label: t("navSecurity"), icon: Lock, exact: false },
    { href: `/${locale}/settings/notifications`, label: t("navNotifications"), icon: Bell, exact: false },
  ];

  return (
    <div className="space-y-6">
      {/* Settings sub-navigation */}
      <nav className="flex gap-1 border-b border-[#D4C5B0] overflow-x-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                active
                  ? "border-[#C8973A] text-[#1C2B3A]"
                  : "border-transparent text-[#8B7355] hover:text-[#1C2B3A] hover:border-[#D4C5B0]"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
