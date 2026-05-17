"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("howItWorks"),  href: `/${locale}/#how-it-works`,    anchor: "how-it-works" },
    { label: t("pricing"),     href: `/${locale}/#pricing`,         anchor: "pricing" },
    { label: t("faq"),         href: `/${locale}/#faq`,             anchor: "faq" },
    { label: t("forLawyers"),  href: `/${locale}/avukatlar-icin`,   anchor: null },
    { label: t("blog"),        href: `/${locale}/blog`,             anchor: null },
  ];

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, anchor: string | null) {
    if (!anchor) return;
    const el = document.getElementById(anchor);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--gold)] focus:px-4 focus:py-2 focus:font-ui focus:text-sm focus:font-semibold focus:text-[var(--navy)]"
      >
        Skip to main content
      </a>
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[var(--navy)] shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-[var(--navy)]/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-xl font-semibold text-[var(--gold)] hover:opacity-90"
        >
          SettleLens
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.anchor)}
              className="font-ui text-sm text-[var(--cream)] opacity-80 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher variant="dark" />
          <Link
            href={`/${locale}/login`}
            className={cn(buttonVariants({ variant: "ghost" }), "text-[var(--cream)] hover:bg-[var(--slate)] hover:text-[var(--cream)]")}
          >
            {t("login")}
          </Link>
          <Link
            href={`/${locale}/register`}
            className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
          >
            {t("startFree")}
          </Link>
        </div>

        <button
          className="flex items-center justify-center text-[var(--cream)] md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--slate)] bg-[var(--navy)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { handleNavClick(e, link.anchor); setMobileOpen(false); }}
                  className="font-ui py-2 text-sm text-[var(--cream)] opacity-80 hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-[var(--slate)] pt-3">
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants({ variant: "ghost" }), "justify-start text-[var(--cream)] hover:bg-[var(--slate)] hover:text-[var(--cream)]")}
                >
                  {t("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants(), "bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold)]/90")}
                >
                  {t("startFree")}
                </Link>
                <div className="mt-1">
                  <LanguageSwitcher variant="dark" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
