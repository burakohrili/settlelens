import type { Metadata } from "next";

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: "Keep or Sell the House in a Divorce? Financial Simulator | SettleLens",
    description:
      "Should you keep the house or sell in a divorce? Model the financial impact of each option. See 5-year net worth differences before you decide. Free tool.",
  },
  tr: {
    title: "Boşanmada Evi Tut mu Sat mı? Finansal Simülatör | SettleLens",
    description:
      "Boşanmada evi tutmak mı yoksa satmak mı daha iyi? Her senaryonun finansal etkisini modelleyin. Karar vermeden önce 5 yıllık net servet farkını görün. Ücretsiz araç.",
  },
  de: {
    title: "Haus behalten oder verkaufen bei Scheidung? Simulator | SettleLens",
    description:
      "Soll das Haus nach der Scheidung behalten oder verkauft werden? Modellieren Sie die finanzielle Auswirkung jeder Option kostenlos.",
  },
  fr: {
    title: "Garder ou vendre la maison lors d'un divorce ? Simulateur | SettleLens",
    description:
      "Faut-il garder la maison ou la vendre lors d'un divorce ? Modélisez l'impact financier de chaque option gratuitement.",
  },
  es: {
    title: "¿Quedarse o vender la casa en el divorcio? Simulador | SettleLens",
    description:
      "¿Conviene quedarse con la casa o venderla en el divorcio? Modela el impacto financiero de cada opción gratuitamente.",
  },
  ar: {
    title: "الاحتفاظ بالمنزل أم بيعه عند الطلاق؟ محاكي مالي | SettleLens",
    description:
      "هل تحتفظ بالمنزل أم تبيعه عند الطلاق؟ نمّذج التأثير المالي لكل خيار مجاناً.",
  },
};

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang] ?? META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `https://settlelens.com/${lang}/house-simulator`,
    },
  };
}

export default function HouseSimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
