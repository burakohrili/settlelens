"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

// ─── Locale-specific mock data ────────────────────────────────────────────────
const LOCALE_DATA = {
  en: {
    sectionTag: "Sample Report",
    headline: "See exactly what you're buying",
    sub: "Every Professional plan includes this attorney-ready financial overview — generated from your real data.",
    cta: "Generate your report →",
    blurLabel: "Full report unlocked with Professional plan",
    footerNote: "Sample data is entirely fictional. Your real report is generated from your own financial data.",
    docLabel: "Attorney-Ready Financial Overview",
    confidential: "CONFIDENTIAL",
    dateLine: "May 2026 · California, US",
    caseMeta: [
      ["Case", "Doe vs. Doe"],
      ["Jurisdiction", "CA — Community Property"],
      ["Marriage", "2011–2025 (14 yrs)"],
      ["Confidence", "Formula-Based Estimate"],
    ],
    kpis: [
      { label: "Net Worth (Now)",    value: "$485,200",      sub: "After debts" },
      { label: "Monthly Cash Flow",  value: "$4,820",        sub: "Post-settlement" },
      { label: "Alimony Range",      value: "$1,200–$1,800", sub: "/month" },
      { label: "Child Support Est.", value: "$820",          sub: "/month" },
    ],
    assetTitle: "Asset Allocation",
    projectionTitle: "10-Year Net Worth Projection",
    assets: [
      { label: "Real Estate",  pct: 52, color: "#1C2B3A" },
      { label: "Retirement",   pct: 28, color: "#C8973A" },
      { label: "Investments",  pct: 14, color: "#4FA86E" },
      { label: "Other",        pct:  6, color: "#D4C5B0" },
    ],
    totalAssets: "$1.24M",
    totalAssetsLabel: "Total Assets",
    scenarios: [
      { name: "Baseline",   net: "$712K", flow: "$4,820/mo", risk: 4, color: "#1C2B3A" },
      { name: "Keep House", net: "$643K", flow: "$3,110/mo", risk: 7, color: "#C8973A" },
      { name: "Sell House", net: "$798K", flow: "$5,640/mo", risk: 3, color: "#4FA86E" },
    ],
    scenarioTitle: "Scenario Comparison",
    scenarioCols: ["Scenario", "Net Worth Yr 10", "Monthly Flow", "Risk"],
    bestLabel: "BEST",
    risk: { high: "High", mid: "Medium", low: "Low" },
    projLegend: [
      { label: "Sell House", color: "#4FA86E", dash: false },
      { label: "Baseline",   color: "#1C2B3A", dash: false },
      { label: "Keep House", color: "#C8973A", dash: true  },
    ],
    blurRisks: [
      "High mortgage-to-income ratio post-split",
      "Retirement funds subject to QDRO — requires court order",
      "Equity market exposure in joint investment account",
      "Alimony duration exceeds 5 years — inflation exposure",
    ],
    blurQuestions: [
      "How will the business valuation be handled given the 2023 revenue spike?",
      "Is the crypto portfolio subject to community property given acquisition dates?",
      "Should we request a QDRO for both retirement accounts simultaneously?",
    ],
    blurStrategyTitle: "Negotiation Strategy",
    blurStrategyText: "Based on the scenario analysis, Scenario C projects the strongest 10-year cash flow position. Consider prioritizing the home equity liquidity event while securing a QDRO for the larger retirement account.",
    blurRiskTitle: "Key Risk Factors",
    blurQTitle: "Questions for Your Lawyer",
    disclaimer: "SettleLens financial modeling — not legal advice. Results based on user-entered data. Jurisdiction: California Community Property. Confidence: formula-based estimate. Always verify with a qualified attorney. Generated May 2026.",
  },
  tr: {
    sectionTag: "Örnek Rapor",
    headline: "Ne satın aldığınızı tam olarak görün",
    sub: "Her Professional plan bu avukatlık hazırlığı finansal özetini içerir — gerçek verilerinizden oluşturulur.",
    cta: "Raporunuzu oluşturun →",
    blurLabel: "Tam rapor Professional plan ile açılır",
    footerNote: "Örnek veriler tamamen kurgusaldır. Gerçek raporunuz kendi finansal verilerinizle oluşturulur.",
    docLabel: "Avukata Hazır Finansal Özet",
    confidential: "GİZLİ",
    dateLine: "Mayıs 2026 · İstanbul, Türkiye",
    caseMeta: [
      ["Dava", "Yılmaz - Yılmaz"],
      ["Yargı Bölgesi", "İstanbul — Edinilmiş Mallar"],
      ["Evlilik", "2011–2025 (14 yıl)"],
      ["Güven Düzeyi", "Formüle Dayalı Tahmin"],
    ],
    kpis: [
      { label: "Net Servet (Şimdi)",  value: "₺1.850.000",     sub: "Borçlar düşüldükten sonra" },
      { label: "Aylık Nakit Akışı",   value: "₺18.400",        sub: "Anlaşma sonrası" },
      { label: "Nafaka Aralığı",      value: "₺4.500–₺6.800",  sub: "/ay" },
      { label: "Nafaka Tahmini",      value: "₺3.100",         sub: "/ay" },
    ],
    assetTitle: "Varlık Dağılımı",
    projectionTitle: "10 Yıllık Net Servet Projeksiyonu",
    assets: [
      { label: "Gayrimenkul",  pct: 52, color: "#1C2B3A" },
      { label: "Emeklilik",    pct: 28, color: "#C8973A" },
      { label: "Yatırımlar",   pct: 14, color: "#4FA86E" },
      { label: "Diğer",        pct:  6, color: "#D4C5B0" },
    ],
    totalAssets: "₺4,7M",
    totalAssetsLabel: "Toplam Varlık",
    scenarios: [
      { name: "Baz Senaryo",    net: "₺2,7M", flow: "₺18.400/ay", risk: 4, color: "#1C2B3A" },
      { name: "Evi Bende Al",   net: "₺2,4M", flow: "₺11.800/ay", risk: 7, color: "#C8973A" },
      { name: "Evi Sat",        net: "₺3,0M", flow: "₺21.500/ay", risk: 3, color: "#4FA86E" },
    ],
    scenarioTitle: "Senaryo Karşılaştırması",
    scenarioCols: ["Senaryo", "10. Yıl Net Servet", "Aylık Akış", "Risk"],
    bestLabel: "EN İYİ",
    risk: { high: "Yüksek", mid: "Orta", low: "Düşük" },
    projLegend: [
      { label: "Evi Sat",      color: "#4FA86E", dash: false },
      { label: "Baz Senaryo",  color: "#1C2B3A", dash: false },
      { label: "Evi Bende Al", color: "#C8973A", dash: true  },
    ],
    blurRisks: [
      "Yüksek ipotek/gelir oranı — anlaşma sonrası nakit akışı baskısı",
      "BES hesabı — mahkeme onayı gerektirir",
      "Ortak yatırım hesabındaki piyasa riski",
      "Nafaka süresi 5 yılı aşıyor — enflasyon riski",
    ],
    blurQuestions: [
      "2023 ciro artışı nedeniyle şirket değerlemesi nasıl belirlenecek?",
      "Kripto portföyü edinilmiş mal mı sayılacak?",
      "Her iki emeklilik hesabı için aynı anda başvuru yapılmalı mı?",
    ],
    blurStrategyTitle: "Müzakere Stratejisi",
    blurStrategyText: "Senaryo analizine göre C senaryosu 10 yıllık en güçlü nakit akışını projeksiyon ediyor. Ev satışından elde edilecek öz varlığı önceliklendirirken BES hesabı için eş zamanlı işlem başlatmayı değerlendirin.",
    blurRiskTitle: "Temel Risk Faktörleri",
    blurQTitle: "Avukatınıza Soracağınız Sorular",
    disclaimer: "SettleLens finansal modelleme — hukuki tavsiye değil. Sonuçlar kullanıcının girdiği verilere dayanır. Yargı bölgesi: İstanbul, Türkiye (TMK 218-241). Güven düzeyi: formüle dayalı tahmin. Nitelikli avukatınızla doğrulayın. Mayıs 2026.",
  },
  de: {
    sectionTag: "Beispielbericht",
    headline: "Sehen Sie genau, was Sie kaufen",
    sub: "Jeder Professional-Plan enthält diese anwaltsbereite Finanzübersicht — aus Ihren echten Daten erstellt.",
    cta: "Ihren Bericht erstellen →",
    blurLabel: "Vollständiger Bericht mit Professional-Plan",
    footerNote: "Beispieldaten sind vollständig fiktiv. Ihr echter Bericht wird mit Ihren eigenen Finanzdaten erstellt.",
    docLabel: "Anwaltsbereite Finanzübersicht",
    confidential: "VERTRAULICH",
    dateLine: "Mai 2026 · Bayern, Deutschland",
    caseMeta: [
      ["Fall", "Müller vs. Müller"],
      ["Zuständigkeit", "Bayern — Zugewinngemeinschaft"],
      ["Ehe", "2011–2025 (14 Jahre)"],
      ["Zuverlässigkeit", "Formelbasierte Schätzung"],
    ],
    kpis: [
      { label: "Nettovermögen (Jetzt)",  value: "€485.200",       sub: "Nach Schulden" },
      { label: "Monatl. Cashflow",       value: "€4.820",         sub: "Nach Scheidung" },
      { label: "Unterhaltsbereich",      value: "€1.200–€1.800",  sub: "/Monat" },
      { label: "Kindesunterhalt ca.",    value: "€820",           sub: "/Monat" },
    ],
    assetTitle: "Vermögensaufteilung",
    projectionTitle: "10-Jahres-Nettovermögensprognose",
    assets: [
      { label: "Immobilien",   pct: 52, color: "#1C2B3A" },
      { label: "Altersvorsorge", pct: 28, color: "#C8973A" },
      { label: "Investitionen", pct: 14, color: "#4FA86E" },
      { label: "Sonstiges",    pct:  6, color: "#D4C5B0" },
    ],
    totalAssets: "€1,24M",
    totalAssetsLabel: "Gesamtvermögen",
    scenarios: [
      { name: "Basislinie",     net: "€712K", flow: "€4.820/Mo.", risk: 4, color: "#1C2B3A" },
      { name: "Haus behalten",  net: "€643K", flow: "€3.110/Mo.", risk: 7, color: "#C8973A" },
      { name: "Haus verkaufen", net: "€798K", flow: "€5.640/Mo.", risk: 3, color: "#4FA86E" },
    ],
    scenarioTitle: "Szenarienvergleich",
    scenarioCols: ["Szenario", "Nettoverm. J. 10", "Monatl. Cashflow", "Risiko"],
    bestLabel: "BEST",
    risk: { high: "Hoch", mid: "Mittel", low: "Niedrig" },
    projLegend: [
      { label: "Haus verkaufen", color: "#4FA86E", dash: false },
      { label: "Basislinie",     color: "#1C2B3A", dash: false },
      { label: "Haus behalten",  color: "#C8973A", dash: true  },
    ],
    blurRisks: [
      "Hohes Hypothek-zu-Einkommen-Verhältnis nach Trennung",
      "Rentenausgleich erfordert Gerichtsanordnung (Versorgungsausgleich)",
      "Aktienmarktrisiko im gemeinsamen Depot",
      "Unterhaltsdauer überschreitet 5 Jahre — Inflationsrisiko",
    ],
    blurQuestions: [
      "Wie wird die Unternehmensbewertung angesichts des Umsatzanstiegs 2023 behandelt?",
      "Ist das Krypto-Portfolio Zugewinn?",
      "Sollte der Versorgungsausgleich für beide Konten gleichzeitig beantragt werden?",
    ],
    blurStrategyTitle: "Verhandlungsstrategie",
    blurStrategyText: "Szenario C prognostiziert die stärkste 10-Jahres-Cashflow-Position. Priorisieren Sie die Immobilienveräußerung und sichern Sie gleichzeitig den Versorgungsausgleich für das größere Rentenkonto.",
    blurRiskTitle: "Wesentliche Risikofaktoren",
    blurQTitle: "Fragen für Ihren Anwalt",
    disclaimer: "SettleLens Finanzmodellierung — keine Rechtsberatung. Ergebnisse basieren auf Nutzereingaben. Zuständigkeit: Bayern, Deutschland (BGB §1363 Zugewinngemeinschaft). Konfidenz: formelbasierte Schätzung. Bitte mit qualifiziertem Anwalt prüfen. Mai 2026.",
  },
  fr: {
    sectionTag: "Exemple de rapport",
    headline: "Voyez exactement ce que vous achetez",
    sub: "Chaque plan Professional inclut ce bilan financier prêt pour votre avocat — généré à partir de vos données réelles.",
    cta: "Générer votre rapport →",
    blurLabel: "Rapport complet débloqué avec le plan Professional",
    footerNote: "Les données d'exemple sont entièrement fictives. Votre vrai rapport est généré avec vos données financières réelles.",
    docLabel: "Bilan financier prêt pour l'avocat",
    confidential: "CONFIDENTIEL",
    dateLine: "Mai 2026 · Île-de-France, France",
    caseMeta: [
      ["Dossier", "Martin vs. Martin"],
      ["Juridiction", "Paris — Communauté d'acquêts"],
      ["Mariage", "2011–2025 (14 ans)"],
      ["Fiabilité", "Estimation fondée sur formule"],
    ],
    kpis: [
      { label: "Patrimoine net (Maint.)",  value: "€485 200",       sub: "Après dettes" },
      { label: "Flux mensuel",            value: "€4 820",         sub: "Post-divorce" },
      { label: "Pension alimentaire",     value: "€1 200–€1 800",  sub: "/mois" },
      { label: "Contrib. enfants est.",   value: "€820",           sub: "/mois" },
    ],
    assetTitle: "Répartition des actifs",
    projectionTitle: "Projection du patrimoine sur 10 ans",
    assets: [
      { label: "Immobilier",   pct: 52, color: "#1C2B3A" },
      { label: "Retraite",     pct: 28, color: "#C8973A" },
      { label: "Placements",   pct: 14, color: "#4FA86E" },
      { label: "Autres",       pct:  6, color: "#D4C5B0" },
    ],
    totalAssets: "€1,24M",
    totalAssetsLabel: "Total actifs",
    scenarios: [
      { name: "Référence",       net: "€712K", flow: "€4 820/mois", risk: 4, color: "#1C2B3A" },
      { name: "Garder maison",   net: "€643K", flow: "€3 110/mois", risk: 7, color: "#C8973A" },
      { name: "Vendre maison",   net: "€798K", flow: "€5 640/mois", risk: 3, color: "#4FA86E" },
    ],
    scenarioTitle: "Comparaison des scénarios",
    scenarioCols: ["Scénario", "Patr. net An 10", "Flux mensuel", "Risque"],
    bestLabel: "MEILLEUR",
    risk: { high: "Élevé", mid: "Moyen", low: "Faible" },
    projLegend: [
      { label: "Vendre",     color: "#4FA86E", dash: false },
      { label: "Référence",  color: "#1C2B3A", dash: false },
      { label: "Garder",     color: "#C8973A", dash: true  },
    ],
    blurRisks: [
      "Ratio hypothèque/revenu élevé après séparation",
      "Partage de la retraite — procédure judiciaire requise",
      "Exposition au marché dans le compte joint",
      "Durée de la pension dépasse 5 ans — risque inflation",
    ],
    blurQuestions: [
      "Comment sera traitée la valorisation de l'entreprise après la hausse de 2023 ?",
      "Le portefeuille crypto est-il un bien acquêt ?",
      "Faut-il demander le partage des deux comptes retraite simultanément ?",
    ],
    blurStrategyTitle: "Stratégie de négociation",
    blurStrategyText: "Le scénario C projette la meilleure position de trésorerie sur 10 ans. Priorisez la liquidation de l'immobilier tout en sécurisant le partage du compte retraite principal.",
    blurRiskTitle: "Facteurs de risque clés",
    blurQTitle: "Questions pour votre avocat",
    disclaimer: "Modélisation financière SettleLens — pas de conseil juridique. Résultats basés sur les données saisies. Juridiction : Paris, France (Code civil Art. 1401). Fiabilité : estimation fondée sur formule. Vérifiez toujours avec un avocat qualifié. Mai 2026.",
  },
  es: {
    sectionTag: "Informe de ejemplo",
    headline: "Vea exactamente lo que está comprando",
    sub: "Cada plan Professional incluye este resumen financiero listo para abogados — generado a partir de tus datos reales.",
    cta: "Genera tu informe →",
    blurLabel: "Informe completo desbloqueado con el plan Professional",
    footerNote: "Los datos de ejemplo son completamente ficticios. Tu informe real se genera con tus propios datos financieros.",
    docLabel: "Resumen financiero listo para abogados",
    confidential: "CONFIDENCIAL",
    dateLine: "Mayo 2026 · Madrid, España",
    caseMeta: [
      ["Caso", "García vs. García"],
      ["Jurisdicción", "Madrid — Sociedad de Gananciales"],
      ["Matrimonio", "2011–2025 (14 años)"],
      ["Fiabilidad", "Estimación basada en fórmula"],
    ],
    kpis: [
      { label: "Patrimonio neto (Ahora)", value: "€485.200",       sub: "Tras deudas" },
      { label: "Flujo mensual",          value: "€4.820",         sub: "Post-divorcio" },
      { label: "Pensión alimenticia",    value: "€1.200–€1.800",  sub: "/mes" },
      { label: "Manutención hijos est.", value: "€820",           sub: "/mes" },
    ],
    assetTitle: "Distribución de activos",
    projectionTitle: "Proyección patrimonial a 10 años",
    assets: [
      { label: "Inmuebles",    pct: 52, color: "#1C2B3A" },
      { label: "Jubilación",   pct: 28, color: "#C8973A" },
      { label: "Inversiones",  pct: 14, color: "#4FA86E" },
      { label: "Otros",        pct:  6, color: "#D4C5B0" },
    ],
    totalAssets: "€1,24M",
    totalAssetsLabel: "Total activos",
    scenarios: [
      { name: "Base",         net: "€712K", flow: "€4.820/mes", risk: 4, color: "#1C2B3A" },
      { name: "Quedar casa",  net: "€643K", flow: "€3.110/mes", risk: 7, color: "#C8973A" },
      { name: "Vender casa",  net: "€798K", flow: "€5.640/mes", risk: 3, color: "#4FA86E" },
    ],
    scenarioTitle: "Comparación de escenarios",
    scenarioCols: ["Escenario", "Patr. neto Año 10", "Flujo mensual", "Riesgo"],
    bestLabel: "MEJOR",
    risk: { high: "Alto", mid: "Medio", low: "Bajo" },
    projLegend: [
      { label: "Vender",     color: "#4FA86E", dash: false },
      { label: "Base",       color: "#1C2B3A", dash: false },
      { label: "Quedar",     color: "#C8973A", dash: true  },
    ],
    blurRisks: [
      "Alta ratio hipoteca/ingresos tras la separación",
      "División del plan de pensiones — requiere orden judicial",
      "Exposición al mercado en la cuenta conjunta",
      "Duración de pensión supera 5 años — riesgo inflación",
    ],
    blurQuestions: [
      "¿Cómo se valorará la empresa dado el aumento de ingresos de 2023?",
      "¿La cartera de criptomonedas es ganancial?",
      "¿Debería solicitarse la división de ambas cuentas de jubilación simultáneamente?",
    ],
    blurStrategyTitle: "Estrategia de negociación",
    blurStrategyText: "El escenario C proyecta la posición de flujo de caja más sólida a 10 años. Priorice la liquidación del inmueble mientras asegura la división del plan de pensiones principal.",
    blurRiskTitle: "Factores de riesgo clave",
    blurQTitle: "Preguntas para su abogado",
    disclaimer: "Modelización financiera SettleLens — no es asesoramiento legal. Resultados basados en los datos introducidos. Jurisdicción: Madrid, España (CC Art. 1344 Gananciales). Fiabilidad: estimación basada en fórmula. Verifique siempre con un abogado cualificado. Mayo 2026.",
  },
  ar: {
    sectionTag: "تقرير نموذجي",
    headline: "شاهد بالضبط ما تشتريه",
    sub: "يتضمن كل خطة Professional هذا الملخص المالي الجاهز للمحامي — مُنشأ من بياناتك الحقيقية.",
    cta: "أنشئ تقريرك ←",
    blurLabel: "التقرير الكامل متاح مع خطة Professional",
    footerNote: "بيانات المثال خيالية بالكامل. يتم إنشاء تقريرك الحقيقي باستخدام بياناتك المالية الفعلية.",
    docLabel: "ملخص مالي جاهز للمحامي",
    confidential: "سري",
    dateLine: "مايو 2026 · دبي، الإمارات",
    caseMeta: [
      ["القضية", "الأحمدي ضد الأحمدي"],
      ["الاختصاص", "دبي — قانون الأحوال الشخصية"],
      ["الزواج", "2011–2025 (14 سنة)"],
      ["مستوى الثقة", "تقدير قائم على صيغة"],
    ],
    kpis: [
      { label: "صافي الثروة (الآن)",    value: "$485,200",      sub: "بعد الديون" },
      { label: "التدفق النقدي الشهري",  value: "$4,820",        sub: "بعد التسوية" },
      { label: "نطاق النفقة",           value: "$1,200–$1,800", sub: "/شهر" },
      { label: "نفقة الأطفال المقدرة",  value: "$820",          sub: "/شهر" },
    ],
    assetTitle: "توزيع الأصول",
    projectionTitle: "توقعات صافي الثروة على 10 سنوات",
    assets: [
      { label: "عقارات",     pct: 52, color: "#1C2B3A" },
      { label: "تقاعد",      pct: 28, color: "#C8973A" },
      { label: "استثمارات",  pct: 14, color: "#4FA86E" },
      { label: "أخرى",       pct:  6, color: "#D4C5B0" },
    ],
    totalAssets: "$1.24M",
    totalAssetsLabel: "إجمالي الأصول",
    scenarios: [
      { name: "الأساس",        net: "$712K", flow: "$4,820/شهر", risk: 4, color: "#1C2B3A" },
      { name: "الاحتفاظ بالمنزل", net: "$643K", flow: "$3,110/شهر", risk: 7, color: "#C8973A" },
      { name: "بيع المنزل",    net: "$798K", flow: "$5,640/شهر", risk: 3, color: "#4FA86E" },
    ],
    scenarioTitle: "مقارنة السيناريوهات",
    scenarioCols: ["السيناريو", "صافي الثروة سنة 10", "التدفق الشهري", "المخاطرة"],
    bestLabel: "الأفضل",
    risk: { high: "مرتفع", mid: "متوسط", low: "منخفض" },
    projLegend: [
      { label: "بيع المنزل",    color: "#4FA86E", dash: false },
      { label: "الأساس",        color: "#1C2B3A", dash: false },
      { label: "الاحتفاظ",     color: "#C8973A", dash: true  },
    ],
    blurRisks: [
      "نسبة رهن/دخل مرتفعة بعد الانفصال",
      "تقسيم صندوق التقاعد — يتطلب أمر المحكمة",
      "تعرض للسوق في الحساب المشترك",
      "مدة النفقة تتجاوز 5 سنوات — مخاطر التضخم",
    ],
    blurQuestions: [
      "كيف سيتم التعامل مع تقييم الشركة مع ارتفاع الإيرادات في 2023؟",
      "هل محفظة العملات المشفرة تخضع للملكية المشتركة؟",
      "هل ينبغي طلب تقسيم كلا حسابَي التقاعد في آنٍ واحد؟",
    ],
    blurStrategyTitle: "استراتيجية التفاوض",
    blurStrategyText: "يُظهر السيناريو (ج) أقوى موقف للتدفق النقدي على مدى 10 سنوات. يُنصح بإعطاء الأولوية لتسييل حقوق الملكية العقارية مع تأمين تقسيم صندوق التقاعد الأكبر.",
    blurRiskTitle: "عوامل الخطر الرئيسية",
    blurQTitle: "أسئلة لمحاميك",
    disclaimer: "نمذجة مالية من SettleLens — ليست استشارة قانونية. النتائج مبنية على البيانات المُدخلة. الاختصاص: دبي، الإمارات. مستوى الثقة: تقدير قائم على صيغة. تحقق دائماً مع محامٍ مؤهل. مايو 2026.",
  },
} as const;

type LocaleKey = keyof typeof LOCALE_DATA;

// ─── Donut chart ──────────────────────────────────────────────────────────────
function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function DonutChart({ assets, totalAssets, totalAssetsLabel }: {
  assets: { label: string; pct: number; color: string }[];
  totalAssets: string;
  totalAssetsLabel: string;
}) {
  const cx = 80; const cy = 80; const R = 64; const innerR = 38;
  let cumulative = 0;
  const slices = assets.map((a) => {
    const start = cumulative;
    const end = cumulative + a.pct * 3.6;
    cumulative = end;
    const s = polarToCartesian(cx, cy, R, start);
    const e = polarToCartesian(cx, cy, R, end);
    const si = polarToCartesian(cx, cy, innerR, start);
    const ei = polarToCartesian(cx, cy, innerR, end);
    const large = a.pct > 50 ? 1 : 0;
    const d = [
      `M ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,
      `A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`,
      `L ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
      "Z",
    ].join(" ");
    return { ...a, d };
  });

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {slices.map((s) => (
        <path key={s.label} d={s.d} fill={s.color} stroke="white" strokeWidth="1.5" />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#1C2B3A" fontSize="11" fontWeight="700">{totalAssets}</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="#8B7355" fontSize="7">{totalAssetsLabel}</text>
    </svg>
  );
}

// ─── Projection chart ─────────────────────────────────────────────────────────
const PROJECTION = [
  { year: "0",   a: 485, b: 485, c: 485 },
  { year: "1",   a: 508, b: 491, c: 524 },
  { year: "3",   a: 542, b: 510, c: 581 },
  { year: "5",   a: 589, b: 545, c: 648 },
  { year: "10",  a: 712, b: 643, c: 798 },
];

function ProjectionChart({ legend }: { legend: { label: string; color: string; dash: boolean }[] }) {
  const w = 260; const h = 120;
  const pad = { l: 32, r: 8, t: 8, b: 24 };
  const maxVal = 850; const minVal = 400;
  const range = maxVal - minVal;
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;

  const xPos = (i: number) => pad.l + (i / (PROJECTION.length - 1)) * cw;
  const yPos = (v: number) => pad.t + ch - ((v - minVal) / range) * ch;

  const line = (key: "a" | "b" | "c") =>
    PROJECTION.map((p, i) => `${i === 0 ? "M" : "L"} ${xPos(i).toFixed(1)} ${yPos(p[key]).toFixed(1)}`).join(" ");

  const area = (key: "a" | "b" | "c") => {
    const pts = PROJECTION.map((p, i) => `${xPos(i).toFixed(1)},${yPos(p[key]).toFixed(1)}`).join(" L ");
    const last = xPos(PROJECTION.length - 1).toFixed(1);
    const first = xPos(0).toFixed(1);
    const base = (pad.t + ch).toFixed(1);
    return `M ${first},${base} L ${pts} L ${last},${base} Z`;
  };

  const ticks = [450, 550, 650, 750];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        {[["ga","#1C2B3A"],["gb","#C8973A"],["gc","#4FA86E"]].map(([id, color]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={w - pad.r} y1={yPos(t)} y2={yPos(t)} stroke="#E5DDD3" strokeWidth="0.5" />
          <text x={pad.l - 4} y={yPos(t) + 3} textAnchor="end" fill="#8B7355" fontSize="7">{t >= 1000 ? `${t/1000}M` : `${t}K`}</text>
        </g>
      ))}
      {PROJECTION.map((p, i) => (
        <text key={i} x={xPos(i)} y={h - 6} textAnchor="middle" fill="#8B7355" fontSize="7">{p.year}</text>
      ))}
      <path d={area("c")} fill="url(#gc)" />
      <path d={area("a")} fill="url(#ga)" />
      <path d={area("b")} fill="url(#gb)" />
      <path d={line("b")} fill="none" stroke="#C8973A" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d={line("a")} fill="none" stroke="#1C2B3A" strokeWidth="1.5" />
      <path d={line("c")} fill="none" stroke="#4FA86E" strokeWidth="2" />
      {(["a","b","c"] as const).map((k, ki) => {
        const colors = ["#1C2B3A","#C8973A","#4FA86E"];
        const last = PROJECTION[PROJECTION.length - 1];
        return <circle key={k} cx={xPos(PROJECTION.length-1)} cy={yPos(last[k])} r={3} fill={colors[ki]} />;
      })}
      {legend.map((l, i) => (
        <g key={l.label} transform={`translate(${pad.l + i * 75}, ${h - 7})`}>
          <line x1={0} x2={10} y1={-3} y2={-3} stroke={l.color} strokeWidth={l.dash ? 1 : 1.5} strokeDasharray={l.dash ? "2 1" : "0"} />
          <text x={13} y={0} fill="#8B7355" fontSize="6">{l.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Risk badge ───────────────────────────────────────────────────────────────
function RiskBadge({ score, labels }: { score: number; labels: { high: string; mid: string; low: string } }) {
  const color = score >= 7 ? "#E85252" : score >= 4 ? "#C8973A" : "#4FA86E";
  const label = score >= 7 ? labels.high : score >= 4 ? labels.mid : labels.low;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-white text-[9px] font-bold" style={{ background: color }}>
      {score} · {label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ReportPreview() {
  const locale = useLocale();
  const d = LOCALE_DATA[(locale as LocaleKey) in LOCALE_DATA ? (locale as LocaleKey) : "en"];

  return (
    <section className="bg-[var(--cream)] py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-2">
            {d.sectionTag}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--navy)] mb-3">
            {d.headline}
          </h2>
          <p className="font-body text-[var(--brown)] max-w-xl mx-auto text-sm">
            {d.sub}
          </p>
        </div>

        {/* PDF mock card */}
        <div className="relative mx-auto max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[var(--sand)]">

          {/* PAGE HEADER */}
          <div className="bg-[var(--navy)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-[var(--gold)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-ui font-bold text-white text-sm tracking-wide">SettleLens</span>
              <span className="font-ui text-[var(--sand)] text-xs hidden sm:inline">· {d.docLabel}</span>
            </div>
            <div className="text-right">
              <p className="font-mono text-[var(--gold)] text-xs">{d.confidential}</p>
              <p className="font-mono text-[var(--sand)] text-[10px]">{d.dateLine}</p>
            </div>
          </div>

          {/* CASE META BAR */}
          <div className="bg-[var(--navy)]/90 px-6 py-2 flex flex-wrap gap-x-6 gap-y-1 border-t border-white/10">
            {d.caseMeta.map(([k, v]) => (
              <div key={k}>
                <p className="font-ui text-[9px] text-[var(--sand)]/70 uppercase tracking-wider">{k}</p>
                <p className="font-ui text-[11px] text-white font-medium">{v}</p>
              </div>
            ))}
          </div>

          {/* BODY */}
          <div className="bg-white px-6 pt-5 pb-0">

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {d.kpis.map((m) => (
                <div key={m.label} className="rounded-lg bg-[var(--cream)] border border-[var(--sand)] p-3">
                  <p className="font-ui text-[9px] text-[var(--brown)] uppercase tracking-wide mb-1">{m.label}</p>
                  <p className="font-mono text-[13px] font-bold text-[var(--navy)]">{m.value}</p>
                  <p className="font-ui text-[9px] text-[var(--brown)]">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-5 gap-4 mb-5">
              <div className="col-span-2 rounded-lg border border-[var(--sand)] p-3">
                <p className="font-ui text-[10px] font-semibold text-[var(--navy)] mb-2 uppercase tracking-wide">{d.assetTitle}</p>
                <div className="flex gap-3 items-center">
                  <div className="w-[120px] h-[120px] shrink-0">
                    <DonutChart assets={[...d.assets] as { label: string; pct: number; color: string }[]} totalAssets={d.totalAssets} totalAssetsLabel={d.totalAssetsLabel} />
                  </div>
                  <div className="space-y-1.5">
                    {d.assets.map((a) => (
                      <div key={a.label} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: a.color }} />
                        <span className="font-ui text-[9px] text-[var(--navy)]">{a.label}</span>
                        <span className="font-mono text-[9px] text-[var(--brown)] ml-auto">{a.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-3 rounded-lg border border-[var(--sand)] p-3">
                <p className="font-ui text-[10px] font-semibold text-[var(--navy)] mb-1 uppercase tracking-wide">{d.projectionTitle}</p>
                <div className="h-[120px]">
                  <ProjectionChart legend={[...d.projLegend] as { label: string; color: string; dash: boolean }[]} />
                </div>
              </div>
            </div>

            {/* Scenario table */}
            <div className="rounded-lg border border-[var(--sand)] overflow-hidden mb-0">
              <div className="bg-[var(--navy)]/5 px-4 py-2 border-b border-[var(--sand)]">
                <p className="font-ui text-[10px] font-semibold text-[var(--navy)] uppercase tracking-wide">{d.scenarioTitle}</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--sand)]">
                    {d.scenarioCols.map((col) => (
                      <th key={col} className="px-4 py-2 text-left last:text-right font-ui text-[9px] font-semibold text-[var(--brown)] uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.scenarios.map((s, i) => (
                    <tr key={s.name} className={`border-b border-[var(--sand)]/50 ${i === 2 ? "bg-[var(--green)]/5" : ""}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                          <span className="font-ui font-medium text-[var(--navy)]">{s.name}</span>
                          {i === 2 && <span className="text-[8px] bg-[var(--green)]/20 text-[var(--green)] px-1.5 rounded font-semibold">{d.bestLabel}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-[var(--navy)]">{s.net}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-[var(--brown)]">{s.flow}</td>
                      <td className="px-4 py-2.5 text-right"><RiskBadge score={s.risk} labels={d.risk} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Blurred section */}
            <div className="relative overflow-hidden mt-0">
              <div className="opacity-30 blur-[3px] select-none pointer-events-none">
                <div className="px-4 py-3 space-y-2 border-t border-[var(--sand)]">
                  <p className="font-ui text-[10px] font-semibold text-[var(--navy)] uppercase tracking-wide">{d.blurRiskTitle}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {d.blurRisks.map((r) => (
                      <div key={r} className="flex gap-2 items-start">
                        <span className="text-[#E85252] text-[10px] mt-0.5">▲</span>
                        <span className="font-ui text-[10px] text-[var(--navy)]">{r}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-ui text-[10px] font-semibold text-[var(--navy)] uppercase tracking-wide mt-3">{d.blurQTitle}</p>
                  <div className="space-y-1">
                    {d.blurQuestions.map((q) => (
                      <p key={q} className="font-ui text-[10px] text-[var(--brown)]">· {q}</p>
                    ))}
                  </div>
                  <p className="font-ui text-[10px] font-semibold text-[var(--navy)] uppercase tracking-wide mt-3">{d.blurStrategyTitle}</p>
                  <p className="font-ui text-[10px] text-[var(--brown)]">{d.blurStrategyText}</p>
                </div>
                <div className="px-4 py-3 border-t border-[var(--sand)] bg-[var(--cream)]/60">
                  <p className="font-ui text-[8px] text-[var(--brown)]">{d.disclaimer}</p>
                </div>
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/40 to-white/95 backdrop-blur-[1px]">
                <div className="text-center px-6 py-5 rounded-xl bg-white/90 border border-[var(--sand)] shadow-lg max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[var(--gold)]">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <p className="font-ui text-xs text-[var(--brown)] mb-3">{d.blurLabel}</p>
                  <Link
                    href={`/${locale}/register`}
                    className="inline-block w-full rounded-lg bg-[var(--gold)] px-4 py-2 font-ui text-sm font-semibold text-white hover:bg-[var(--gold)]/90 transition-colors"
                  >
                    {d.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center font-ui text-xs text-[var(--brown)] mt-6 opacity-70">
          {d.footerNote}
        </p>
      </div>
    </section>
  );
}
