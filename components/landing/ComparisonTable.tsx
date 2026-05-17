"use client";

import { useLocale } from "next-intl";
import { Check, X, Minus } from "lucide-react";

type Cell = "yes" | "no" | "partial" | string;

type Row = {
  feature: string;
  settlelens: Cell;
  attorney: Cell;
  excel: Cell;
  nothing: Cell;
};

type TableData = {
  title: string;
  subtitle: string;
  headers: { settlelens: string; attorney: string; excel: string; nothing: string };
  rows: Row[];
  note: string;
};

const DATA: Record<string, TableData> = {
  en: {
    title: "How does SettleLens compare?",
    subtitle: "See what each option actually gives you before negotiation day.",
    headers: {
      settlelens: "SettleLens",
      attorney: "Attorney Only",
      excel: "Spreadsheet",
      nothing: "No Preparation",
    },
    rows: [
      { feature: "10-year financial projection", settlelens: "yes", attorney: "partial", excel: "no", nothing: "no" },
      { feature: "Scenario comparison (3+ options)", settlelens: "yes", attorney: "partial", excel: "partial", nothing: "no" },
      { feature: "Jurisdiction-aware assumptions", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Available 24 / 7", settlelens: "yes", attorney: "no", excel: "yes", nothing: "yes" },
      { feature: "Organized for attorney review", settlelens: "yes", attorney: "yes", excel: "partial", nothing: "no" },
      { feature: "Cost to model one scenario", settlelens: "$29", attorney: "$300–$500/hr", excel: "$0", nothing: "$0" },
      { feature: "Risk score & key risk flags", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Data stays private", settlelens: "yes", attorney: "yes", excel: "yes", nothing: "yes" },
    ],
    note: "SettleLens does not replace a lawyer. It helps you arrive at every conversation better prepared.",
  },
  tr: {
    title: "SettleLens diğer seçeneklerle nasıl karşılaştırılır?",
    subtitle: "Müzakere gününden önce her seçeneğin size ne kazandırdığını görün.",
    headers: {
      settlelens: "SettleLens",
      attorney: "Yalnız Avukat",
      excel: "Excel Tablosu",
      nothing: "Hazırlıksız",
    },
    rows: [
      { feature: "10 yıllık finansal projeksiyon", settlelens: "yes", attorney: "partial", excel: "no", nothing: "no" },
      { feature: "Senaryo karşılaştırması (3+ seçenek)", settlelens: "yes", attorney: "partial", excel: "partial", nothing: "no" },
      { feature: "Yargı alanına özel varsayımlar", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "7/24 erişilebilir", settlelens: "yes", attorney: "no", excel: "yes", nothing: "yes" },
      { feature: "Avukat görüşmesine hazır format", settlelens: "yes", attorney: "yes", excel: "partial", nothing: "no" },
      { feature: "Tek senaryo maliyeti", settlelens: "899 ₺", attorney: "2.000–5.000 ₺/saat", excel: "0 ₺", nothing: "0 ₺" },
      { feature: "Risk skoru & risk uyarıları", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Veri gizliliği", settlelens: "yes", attorney: "yes", excel: "yes", nothing: "yes" },
    ],
    note: "SettleLens avukatın yerini almaz. Her görüşmeye daha hazırlıklı gitmenizi sağlar.",
  },
  de: {
    title: "Wie schneidet SettleLens im Vergleich ab?",
    subtitle: "Sehen Sie, was jede Option tatsächlich bietet — bevor Sie verhandeln.",
    headers: {
      settlelens: "SettleLens",
      attorney: "Nur Anwalt",
      excel: "Tabellenkalkulation",
      nothing: "Keine Vorbereitung",
    },
    rows: [
      { feature: "10-Jahres-Finanzprojektion", settlelens: "yes", attorney: "partial", excel: "no", nothing: "no" },
      { feature: "Szenarienvergleich (3+ Optionen)", settlelens: "yes", attorney: "partial", excel: "partial", nothing: "no" },
      { feature: "Länderspezifische Annahmen", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Rund um die Uhr verfügbar", settlelens: "yes", attorney: "no", excel: "yes", nothing: "yes" },
      { feature: "Strukturiert für Anwaltsgespräch", settlelens: "yes", attorney: "yes", excel: "partial", nothing: "no" },
      { feature: "Kosten pro Szenario", settlelens: "27 €", attorney: "150–350 €/Std.", excel: "0 €", nothing: "0 €" },
      { feature: "Risikobewertung & Risikohinweise", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Datenschutz gewährleistet", settlelens: "yes", attorney: "yes", excel: "yes", nothing: "yes" },
    ],
    note: "SettleLens ersetzt keinen Anwalt. Es hilft Ihnen, zu jedem Gespräch besser vorbereitet zu erscheinen.",
  },
  fr: {
    title: "Comment SettleLens se compare-t-il ?",
    subtitle: "Voyez ce que chaque option vous apporte vraiment avant de négocier.",
    headers: {
      settlelens: "SettleLens",
      attorney: "Avocat seul",
      excel: "Tableur",
      nothing: "Sans préparation",
    },
    rows: [
      { feature: "Projection financière sur 10 ans", settlelens: "yes", attorney: "partial", excel: "no", nothing: "no" },
      { feature: "Comparaison de scénarios (3+)", settlelens: "yes", attorney: "partial", excel: "partial", nothing: "no" },
      { feature: "Hypothèses adaptées à votre pays", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Disponible 24h/24, 7j/7", settlelens: "yes", attorney: "no", excel: "yes", nothing: "yes" },
      { feature: "Format prêt pour votre avocat", settlelens: "yes", attorney: "yes", excel: "partial", nothing: "no" },
      { feature: "Coût par scénario", settlelens: "27 €", attorney: "200–400 €/h", excel: "0 €", nothing: "0 €" },
      { feature: "Score de risque & alertes", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Confidentialité des données", settlelens: "yes", attorney: "yes", excel: "yes", nothing: "yes" },
    ],
    note: "SettleLens ne remplace pas un avocat. Il vous aide à aborder chaque rendez-vous mieux préparé(e).",
  },
  es: {
    title: "¿Cómo se compara SettleLens?",
    subtitle: "Comprueba qué te ofrece realmente cada opción antes de negociar.",
    headers: {
      settlelens: "SettleLens",
      attorney: "Solo abogado",
      excel: "Hoja de cálculo",
      nothing: "Sin preparación",
    },
    rows: [
      { feature: "Proyección financiera a 10 años", settlelens: "yes", attorney: "partial", excel: "no", nothing: "no" },
      { feature: "Comparación de escenarios (3+)", settlelens: "yes", attorney: "partial", excel: "partial", nothing: "no" },
      { feature: "Supuestos adaptados a tu país", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Disponible 24/7", settlelens: "yes", attorney: "no", excel: "yes", nothing: "yes" },
      { feature: "Formato listo para tu abogado", settlelens: "yes", attorney: "yes", excel: "partial", nothing: "no" },
      { feature: "Coste por escenario", settlelens: "27 €", attorney: "150–350 €/h", excel: "0 €", nothing: "0 €" },
      { feature: "Puntuación de riesgo y alertas", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "Privacidad de datos garantizada", settlelens: "yes", attorney: "yes", excel: "yes", nothing: "yes" },
    ],
    note: "SettleLens no reemplaza a un abogado. Te ayuda a llegar a cada conversación mejor preparado/a.",
  },
  ar: {
    title: "كيف يقارن SettleLens بالخيارات الأخرى؟",
    subtitle: "تعرّف على ما تقدمه كل خيار فعلياً قبل يوم التفاوض.",
    headers: {
      settlelens: "SettleLens",
      attorney: "المحامي فقط",
      excel: "جداول بيانات",
      nothing: "بدون تحضير",
    },
    rows: [
      { feature: "توقع مالي لمدة 10 سنوات", settlelens: "yes", attorney: "partial", excel: "no", nothing: "no" },
      { feature: "مقارنة السيناريوهات (3+)", settlelens: "yes", attorney: "partial", excel: "partial", nothing: "no" },
      { feature: "افتراضات مناسبة لبلدك", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "متاح على مدار الساعة", settlelens: "yes", attorney: "no", excel: "yes", nothing: "yes" },
      { feature: "تنسيق جاهز للمراجعة القانونية", settlelens: "yes", attorney: "yes", excel: "partial", nothing: "no" },
      { feature: "تكلفة كل سيناريو", settlelens: "$29", attorney: "$300–$500/س", excel: "$0", nothing: "$0" },
      { feature: "درجة المخاطرة والتحذيرات", settlelens: "yes", attorney: "yes", excel: "no", nothing: "no" },
      { feature: "خصوصية البيانات مضمونة", settlelens: "yes", attorney: "yes", excel: "yes", nothing: "yes" },
    ],
    note: "SettleLens لا يحل محل المحامي. يساعدك على الحضور إلى كل اجتماع بتحضير أفضل.",
  },
};

function CellIcon({ value, isSettleLens }: { value: Cell; isSettleLens?: boolean }) {
  if (value === "yes") {
    return (
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isSettleLens ? "bg-[var(--gold)]/20 text-[var(--gold)]" : "bg-[var(--green)]/15 text-[var(--green)]"}`}>
        <Check size={13} strokeWidth={2.5} />
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--red)]/10 text-[var(--red)]/70">
        <X size={13} strokeWidth={2.5} />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--sand)]/40 text-[var(--brown)]">
        <Minus size={13} strokeWidth={2.5} />
      </span>
    );
  }
  return <span className="font-mono text-xs text-[var(--brown)] whitespace-nowrap">{value}</span>;
}

export function ComparisonTable() {
  const locale = useLocale();
  const data = DATA[locale] ?? DATA.en;

  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--navy)] mb-4">
            {data.title}
          </h2>
          <p className="font-body text-[var(--brown)] text-lg max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[var(--sand)] shadow-sm">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-[var(--navy)]">
                <th className="text-left px-5 py-4 font-ui text-sm font-medium text-white/60 w-[35%]" />
                <th className="px-4 py-4 text-center">
                  <span className="font-ui text-sm font-semibold text-[var(--gold)]">
                    {data.headers.settlelens}
                  </span>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="font-ui text-sm font-medium text-white/70">
                    {data.headers.attorney}
                  </span>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="font-ui text-sm font-medium text-white/70">
                    {data.headers.excel}
                  </span>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="font-ui text-sm font-medium text-white/70">
                    {data.headers.nothing}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-[var(--sand)] ${i % 2 === 0 ? "bg-white" : "bg-[var(--cream)]"}`}
                >
                  <td className="px-5 py-3.5 font-body text-sm text-[var(--navy)]">
                    {row.feature}
                  </td>
                  <td className="px-4 py-3.5 text-center bg-[var(--gold)]/5">
                    <CellIcon value={row.settlelens} isSettleLens />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <CellIcon value={row.attorney} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <CellIcon value={row.excel} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <CellIcon value={row.nothing} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-center font-body text-sm text-[var(--brown)] italic">
          {data.note}
        </p>
      </div>
    </section>
  );
}
