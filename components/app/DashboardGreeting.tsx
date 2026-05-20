"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  name: string;
};

export function DashboardGreeting({ name }: Props) {
  const t = useTranslations("dashboard");
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? t("greeting.morning") : h < 17 ? t("greeting.afternoon") : t("greeting.evening")
    );
  }, [t]);

  return (
    <h1 className="font-display text-2xl font-bold text-[var(--navy)]">
      {greeting ?? t("welcomeBack")}, {name.split(" ")[0]}.
    </h1>
  );
}
