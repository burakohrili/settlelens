"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  FileText,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "dashboard" },
  { key: "scenarios", label: "Scenarios", icon: GitBranch, href: "scenarios" },
  { key: "report", label: "Report", icon: FileText, href: "report" },
  { key: "settings", label: "Settings", icon: Settings, href: "settings" },
];

type Props = { planType?: string };

export function AppSidebar({ planType = "discovery" }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const isFree = planType === "discovery";

  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--sand)] bg-[var(--cream)] md:flex">
        <nav className="flex flex-1 flex-col gap-1 p-3 pt-4">
          {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
            const fullHref = `/${locale}/${href}`;
            const active = pathname.startsWith(fullHref);
            return (
              <Link
                key={key}
                href={fullHref}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 font-ui text-sm transition-colors",
                  active
                    ? "bg-[var(--navy)] text-[var(--cream)]"
                    : "text-[var(--navy)] hover:bg-[var(--sand)]/60"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {isFree && (
          <div className="m-3 rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 p-3">
            <p className="font-ui text-xs text-[var(--navy)] font-semibold">
              Upgrade to Clarified
            </p>
            <p className="mt-0.5 font-ui text-xs text-[var(--brown)]">
              Get your first AI analysis
            </p>
            <Link
              href={`/${locale}/upgrade`}
              className={cn(buttonVariants({ size: "sm" }), "mt-2 w-full bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/90 text-xs justify-center")}
            >
              <Zap size={12} className="mr-1" /> Upgrade
            </Link>
          </div>
        )}
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-[var(--sand)] bg-[var(--cream)] md:hidden">
        {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
          const fullHref = `/${locale}/${href}`;
          const active = pathname.startsWith(fullHref);
          return (
            <Link
              key={key}
              href={fullHref}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 font-ui text-[10px]",
                active ? "text-[var(--gold)]" : "text-[var(--brown)]"
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
