import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

function escapeHtml(text: string | undefined | null): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: true,
    timeout: 30_000,
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 20_000 });
  const pdf = await page.pdf({
    format: "A4",
    margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    printBackground: true,
  });
  await browser.close();
  return Buffer.from(pdf);
}

type ReportAsset = {
  name: string;
  category: string;
  current_value: number;
  owned_by: string;
  mortgage_balance?: number;
  purchase_price?: number | null;
  is_marital?: boolean;
  outcome?: string;      // i_keep | spouse_keeps | sell | split:N%_to_me | not_decided
  split_pct_me?: number; // for financial assets
  crypto_token?: string;
  crypto_quantity?: number;
  crypto_exchange?: string;
};

type ReportData = {
  userName: string;
  jurisdiction: string;
  date: string;
  lang: string;
  isLawyerEdition?: boolean;
  assets: ReportAsset[];
  debts: Array<{ name: string; category: string; balance: number; monthly_payment: number; owned_by?: string }>;
  scenarios: Array<{
    name: string;
    net_worth_now: number;
    year1: number;
    year3: number;
    year5: number;
    year10: number;
    monthly_cashflow: number;
    risk_score: number;
    alimony_range_low: number;
    alimony_range_high: number;
    child_support_estimate: number;
    negotiation_strategy: string;
    key_risks: string[];
    confidence_label_text: string;
    assets?: ReportAsset[];  // per-scenario assets with outcome
    retirement_split_me?: number;
  }>;
  currency: string;
};

const OUTCOME_PDF_LABELS: Record<string, Record<string, string>> = {
  i_keep:       { en: "I Keep", tr: "Bende kalıyor", de: "Ich behalte", fr: "Je garde", es: "Lo conservo", ar: "أحتفظ به" },
  spouse_keeps: { en: "Spouse Keeps", tr: "Eşimde kalıyor", de: "Partner behält", fr: "Conjoint garde", es: "Cónyuge conserva", ar: "الزوج يحتفظ" },
  sell:         { en: "Sell", tr: "Satış", de: "Verkauf", fr: "Vente", es: "Venta", ar: "بيع" },
  not_decided:  { en: "Not Decided", tr: "Karar verilmedi", de: "Unentschieden", fr: "Non décidé", es: "Sin decidir", ar: "غير محدد" },
};

function outcomeLabel(outcome: string | undefined, lang: string): string {
  if (!outcome || outcome === "not_decided") return OUTCOME_PDF_LABELS.not_decided[lang] ?? OUTCOME_PDF_LABELS.not_decided.en;
  if (outcome.startsWith("split:")) {
    const pct = outcome.replace("split:", "").replace("%_to_me", "");
    const splitWord = { en: "Split", tr: "Paylaş", de: "Teilen", fr: "Partage", es: "División", ar: "تقسيم" }[lang] ?? "Split";
    return `${splitWord} ${pct}%`;
  }
  return OUTCOME_PDF_LABELS[outcome]?.[lang] ?? OUTCOME_PDF_LABELS[outcome]?.en ?? outcome;
}

function calcUserShare(a: ReportAsset): number {
  const equity = (a.current_value ?? 0) - (a.mortgage_balance ?? 0);
  if (!a.outcome || a.outcome === "not_decided") return equity * 0.5;
  if (a.outcome === "i_keep") return equity;
  if (a.outcome === "spouse_keeps") return 0;
  if (a.outcome === "sell") return equity * 0.92 * 0.5;
  if (a.outcome.startsWith("split:")) {
    const pct = parseFloat(a.outcome.replace("split:", "").replace("%_to_me", "")) / 100;
    return ((a.current_value ?? 0) - (a.mortgage_balance ?? 0)) * (isNaN(pct) ? 0.5 : pct);
  }
  return equity * 0.5;
}

type LabelSet = {
  reportTitle: string;
  preparedFor: string;
  date: string;
  jurisdiction: string;
  scenariosAnalyzed: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  netWorthSummary: string;
  totalAssets: string;
  totalDebts: string;
  netWorth: string;
  assets: string;
  debts: string;
  name: string;
  category: string;
  currentValue: string;
  ownedBy: string;
  balance: string;
  monthlyPayment: string;
  scenarioAnalysis: string;
  scenario: string;
  metric: string;
  value: string;
  netWorthNow: string;
  year1: string;
  year3: string;
  year5: string;
  year10: string;
  monthlyCashFlow: string;
  riskScore: string;
  alimonyRange: string;
  childSupport: string;
  keyRisks: string;
  financialNote: string;
  cryptoNotice: string;
  cryptoNoticeText: string;
  footerLine1: string;
  footerLine2: string;
  footerLine3: string;
  reportGenerated: string;
  mo: string;
  heldAt: string;
  qty: string;
  token: string;
  assetAllocation: string;
  mortgage: string;
  outcome: string;
  yourShare: string;
  maritalGainNote: string;
  financialAssetNote: string;
  lawyerEditionBadge: string;
  questionsForLawyer: string;
};

const REPORT_LABELS: Record<string, LabelSet> = {
  en: {
    reportTitle: "Financial Analysis Report",
    preparedFor: "Prepared for",
    date: "Date",
    jurisdiction: "Jurisdiction",
    scenariosAnalyzed: "Scenarios analyzed",
    disclaimerTitle: "FINANCIAL MODELING ONLY — NOT LEGAL OR FINANCIAL ADVICE",
    disclaimerBody: "This report is an attorney-ready financial overview for personal planning purposes. It does not constitute legal advice, predict court outcomes, or guarantee any settlement result. Always consult a qualified family law attorney before making decisions.",
    netWorthSummary: "Net Worth Summary",
    totalAssets: "Total Assets",
    totalDebts: "Total Debts",
    netWorth: "Net Worth",
    assets: "Assets",
    debts: "Debts",
    name: "Name",
    category: "Category",
    currentValue: "Current Value",
    ownedBy: "Owned By",
    balance: "Balance",
    monthlyPayment: "Monthly Payment",
    scenarioAnalysis: "Scenario Analysis",
    scenario: "Scenario",
    metric: "Metric",
    value: "Value",
    netWorthNow: "Net Worth Now",
    year1: "Year 1 Projection",
    year3: "Year 3 Projection",
    year5: "Year 5 Projection",
    year10: "Year 10 Projection",
    monthlyCashFlow: "Monthly Cash Flow",
    riskScore: "Risk Score",
    alimonyRange: "Alimony Estimate Range",
    childSupport: "Child Support Estimate",
    keyRisks: "Key Risks",
    financialNote: "Financial Positioning Note",
    cryptoNotice: "Crypto Asset Notice",
    cryptoNoticeText: "Cryptocurrency values are highly volatile and user-stated. Professional appraisal is recommended for any legal proceedings.",
    footerLine1: "Generated by SettleLens — Financial Scenario Modeling for Divorce Preparation | settlelens.com",
    footerLine2: "SettleLens provides financial modeling for informational purposes only. This is not legal advice, financial advice, or a court document. Jurisdiction-specific property rules have been applied as assumptions only. Always verify with a qualified family law attorney in your jurisdiction.",
    footerLine3: "Data entered by user — SettleLens has not independently verified any values.",
    reportGenerated: "Report generated",
    mo: "/mo",
    heldAt: "Held at",
    qty: "Qty",
    token: "Token",
    assetAllocation: "Asset Allocation by Scenario",
    mortgage: "Mortgage / Loan",
    outcome: "Outcome",
    yourShare: "Your Share",
    maritalGainNote: "* Assets with original purchase price: marital appreciation is calculated separately under applicable jurisdiction rules.",
    financialAssetNote: "Financial assets (bank/retirement/investments) split at",
    lawyerEditionBadge: "Attorney-Ready Financial Overview",
    questionsForLawyer: "Questions for Your Lawyer",
  },
  tr: {
    reportTitle: "Finansal Analiz Raporu",
    preparedFor: "Hazırlayan",
    date: "Tarih",
    jurisdiction: "Yargı Alanı",
    scenariosAnalyzed: "Analiz edilen senaryo",
    disclaimerTitle: "YALNIZCA FİNANSAL MODELLEME — HUKUKİ VEYA MALİ TAVSİYE DEĞİLDİR",
    disclaimerBody: "Bu rapor kişisel planlama amacıyla hazırlanmış bir finansal özettir. Hukuki tavsiye niteliği taşımaz, mahkeme sonuçlarını tahmin etmez ve herhangi bir anlaşma sonucunu garanti etmez. Karar vermeden önce nitelikli bir aile hukuku avukatına danışınız.",
    netWorthSummary: "Net Servet Özeti",
    totalAssets: "Toplam Varlıklar",
    totalDebts: "Toplam Borçlar",
    netWorth: "Net Servet",
    assets: "Varlıklar",
    debts: "Borçlar",
    name: "Ad",
    category: "Kategori",
    currentValue: "Güncel Değer",
    ownedBy: "Sahibi",
    balance: "Bakiye",
    monthlyPayment: "Aylık Ödeme",
    scenarioAnalysis: "Senaryo Analizi",
    scenario: "Senaryo",
    metric: "Metrik",
    value: "Değer",
    netWorthNow: "Şu Anki Net Servet",
    year1: "1. Yıl Projeksiyonu",
    year3: "3. Yıl Projeksiyonu",
    year5: "5. Yıl Projeksiyonu",
    year10: "10. Yıl Projeksiyonu",
    monthlyCashFlow: "Aylık Nakit Akışı",
    riskScore: "Risk Skoru",
    alimonyRange: "Nafaka Tahmin Aralığı",
    childSupport: "Çocuk Nafakası Tahmini",
    keyRisks: "Temel Riskler",
    financialNote: "Finansal Konumlanma Notu",
    cryptoNotice: "Kripto Varlık Uyarısı",
    cryptoNoticeText: "Kripto para değerleri yüksek dalgalanma gösterir ve kullanıcı tarafından beyan edilmiştir. Yasal işlemler için profesyonel değerleme önerilir.",
    footerLine1: "SettleLens tarafından oluşturuldu — Boşanma Hazırlığı için Finansal Senaryo Modelleme | settlelens.com",
    footerLine2: "SettleLens yalnızca bilgilendirme amacıyla finansal modelleme sağlar. Bu bir hukuki tavsiye, mali danışmanlık veya mahkeme belgesi değildir. Yargı alanına özgü mülkiyet kuralları yalnızca varsayım olarak uygulanmıştır. Yargı alanınızdaki nitelikli bir aile hukuku avukatıyla doğrulayınız.",
    footerLine3: "Veriler kullanıcı tarafından girilmiştir — SettleLens hiçbir değeri bağımsız olarak doğrulamamıştır.",
    reportGenerated: "Rapor oluşturuldu",
    mo: "/ay",
    heldAt: "Saklandığı yer",
    qty: "Miktar",
    token: "Token",
    assetAllocation: "Senaryoya Göre Varlık Dağılımı",
    mortgage: "Mortgage / Kredi",
    outcome: "Karar",
    yourShare: "Payınız",
    maritalGainNote: "* Satın alma fiyatı olan varlıklar: Evlilik kazancı, geçerli yargı kurallarına göre ayrıca hesaplanır.",
    financialAssetNote: "Finansal varlıklar (banka/emeklilik/yatırım) şu oranda bölünüyor",
    lawyerEditionBadge: "Avukata Hazır Finansal Özet",
    questionsForLawyer: "Avukatınıza Soracağınız Sorular",
  },
  de: {
    reportTitle: "Finanzanalyse-Bericht",
    preparedFor: "Erstellt für",
    date: "Datum",
    jurisdiction: "Rechtsgebiet",
    scenariosAnalyzed: "Analysierte Szenarien",
    disclaimerTitle: "NUR FINANZMODELLIERUNG — KEINE RECHTS- ODER FINANZBERATUNG",
    disclaimerBody: "Dieser Bericht ist eine für Anwälte geeignete Finanzübersicht für persönliche Planungszwecke. Er stellt keine Rechtsberatung dar, sagt keine Gerichtsergebnisse voraus und garantiert kein Vergleichsergebnis. Konsultieren Sie immer einen qualifizierten Familienrechtsanwalt.",
    netWorthSummary: "Nettovermögen-Übersicht",
    totalAssets: "Gesamtvermögen",
    totalDebts: "Gesamtschulden",
    netWorth: "Nettovermögen",
    assets: "Vermögen",
    debts: "Schulden",
    name: "Name",
    category: "Kategorie",
    currentValue: "Aktueller Wert",
    ownedBy: "Eigentümer",
    balance: "Guthaben",
    monthlyPayment: "Monatliche Zahlung",
    scenarioAnalysis: "Szenarioanalyse",
    scenario: "Szenario",
    metric: "Kennzahl",
    value: "Wert",
    netWorthNow: "Aktuelles Nettovermögen",
    year1: "Jahr 1 Prognose",
    year3: "Jahr 3 Prognose",
    year5: "Jahr 5 Prognose",
    year10: "Jahr 10 Prognose",
    monthlyCashFlow: "Monatlicher Cashflow",
    riskScore: "Risikobewertung",
    alimonyRange: "Unterhaltsprognose",
    childSupport: "Kindesunterhalt Schätzung",
    keyRisks: "Hauptrisiken",
    financialNote: "Finanzielle Positionierungsnotiz",
    cryptoNotice: "Krypto-Asset-Hinweis",
    cryptoNoticeText: "Kryptowährungswerte sind hochvolatil und vom Benutzer angegeben. Für rechtliche Verfahren wird eine professionelle Bewertung empfohlen.",
    footerLine1: "Erstellt von SettleLens — Finanzielle Szenariomodellierung für Scheidungsvorbereitung | settlelens.com",
    footerLine2: "SettleLens bietet Finanzmodellierung nur zu Informationszwecken. Dies ist keine Rechtsberatung, Finanzberatung oder ein Gerichtsdokument. Gebietsspezifische Eigentumsregeln wurden nur als Annahmen angewendet. Überprüfen Sie dies immer mit einem qualifizierten Familienrechtsanwalt.",
    footerLine3: "Daten vom Benutzer eingegeben — SettleLens hat keine Werte unabhängig verifiziert.",
    reportGenerated: "Bericht erstellt",
    mo: "/Monat",
    heldAt: "Aufbewahrt bei",
    qty: "Menge",
    token: "Token",
    assetAllocation: "Vermögensaufteilung nach Szenario",
    mortgage: "Hypothek / Darlehen",
    outcome: "Ergebnis",
    yourShare: "Ihr Anteil",
    maritalGainNote: "* Vermögenswerte mit Kaufpreis: Ehezeitlicher Zugewinn wird nach geltendem Recht separat berechnet.",
    financialAssetNote: "Finanzielle Vermögenswerte (Bank/Rente/Investitionen) aufgeteilt zu",
    lawyerEditionBadge: "Anwaltsgerechte Finanzübersicht",
    questionsForLawyer: "Fragen für Ihren Anwalt",
  },
  fr: {
    reportTitle: "Rapport d'analyse financière",
    preparedFor: "Préparé pour",
    date: "Date",
    jurisdiction: "Juridiction",
    scenariosAnalyzed: "Scénarios analysés",
    disclaimerTitle: "MODÉLISATION FINANCIÈRE UNIQUEMENT — PAS DE CONSEIL JURIDIQUE OU FINANCIER",
    disclaimerBody: "Ce rapport est un aperçu financier destiné aux professionnels juridiques à des fins de planification personnelle. Il ne constitue pas un conseil juridique, ne prédit pas les résultats judiciaires et ne garantit aucun résultat de règlement. Consultez toujours un avocat spécialisé en droit de la famille.",
    netWorthSummary: "Résumé du patrimoine net",
    totalAssets: "Total des actifs",
    totalDebts: "Total des dettes",
    netWorth: "Patrimoine net",
    assets: "Actifs",
    debts: "Dettes",
    name: "Nom",
    category: "Catégorie",
    currentValue: "Valeur actuelle",
    ownedBy: "Propriétaire",
    balance: "Solde",
    monthlyPayment: "Paiement mensuel",
    scenarioAnalysis: "Analyse des scénarios",
    scenario: "Scénario",
    metric: "Métrique",
    value: "Valeur",
    netWorthNow: "Patrimoine net actuel",
    year1: "Projection année 1",
    year3: "Projection année 3",
    year5: "Projection année 5",
    year10: "Projection année 10",
    monthlyCashFlow: "Flux de trésorerie mensuel",
    riskScore: "Score de risque",
    alimonyRange: "Estimation de la pension alimentaire",
    childSupport: "Estimation de la pension pour enfants",
    keyRisks: "Risques principaux",
    financialNote: "Note de positionnement financier",
    cryptoNotice: "Avis sur les actifs cryptographiques",
    cryptoNoticeText: "Les valeurs des crypto-monnaies sont très volatiles et déclarées par l'utilisateur. Une évaluation professionnelle est recommandée pour toute procédure juridique.",
    footerLine1: "Généré par SettleLens — Modélisation de scénarios financiers pour la préparation au divorce | settlelens.com",
    footerLine2: "SettleLens fournit une modélisation financière à des fins d'information uniquement. Ce n'est pas un conseil juridique, un conseil financier ou un document judiciaire. Les règles de propriété spécifiques à la juridiction ont été appliquées comme hypothèses uniquement. Vérifiez toujours avec un avocat spécialisé en droit de la famille.",
    footerLine3: "Données saisies par l'utilisateur — SettleLens n'a pas vérifié indépendamment les valeurs.",
    reportGenerated: "Rapport généré",
    mo: "/mois",
    heldAt: "Conservé chez",
    qty: "Quantité",
    token: "Token",
    assetAllocation: "Répartition des actifs par scénario",
    mortgage: "Hypothèque / Prêt",
    outcome: "Issue",
    yourShare: "Votre part",
    maritalGainNote: "* Actifs avec prix d'achat : la plus-value maritale est calculée séparément selon les règles juridictionnelles applicables.",
    financialAssetNote: "Actifs financiers (banque/retraite/investissements) partagés à",
    lawyerEditionBadge: "Aperçu financier pour votre avocat",
    questionsForLawyer: "Questions pour votre avocat",
  },
  es: {
    reportTitle: "Informe de análisis financiero",
    preparedFor: "Preparado para",
    date: "Fecha",
    jurisdiction: "Jurisdicción",
    scenariosAnalyzed: "Escenarios analizados",
    disclaimerTitle: "SOLO MODELIZACIÓN FINANCIERA — NO ES ASESORAMIENTO LEGAL O FINANCIERO",
    disclaimerBody: "Este informe es una descripción financiera preparada para abogados con fines de planificación personal. No constituye asesoramiento legal, no predice resultados judiciales ni garantiza ningún resultado de acuerdo. Siempre consulte a un abogado de familia calificado.",
    netWorthSummary: "Resumen del patrimonio neto",
    totalAssets: "Total de activos",
    totalDebts: "Total de deudas",
    netWorth: "Patrimonio neto",
    assets: "Activos",
    debts: "Deudas",
    name: "Nombre",
    category: "Categoría",
    currentValue: "Valor actual",
    ownedBy: "Propietario",
    balance: "Saldo",
    monthlyPayment: "Pago mensual",
    scenarioAnalysis: "Análisis de escenarios",
    scenario: "Escenario",
    metric: "Métrica",
    value: "Valor",
    netWorthNow: "Patrimonio neto actual",
    year1: "Proyección año 1",
    year3: "Proyección año 3",
    year5: "Proyección año 5",
    year10: "Proyección año 10",
    monthlyCashFlow: "Flujo de caja mensual",
    riskScore: "Puntuación de riesgo",
    alimonyRange: "Estimación de pensión alimenticia",
    childSupport: "Estimación de manutención infantil",
    keyRisks: "Riesgos principales",
    financialNote: "Nota de posicionamiento financiero",
    cryptoNotice: "Aviso sobre activos criptográficos",
    cryptoNoticeText: "Los valores de criptomonedas son muy volátiles y declarados por el usuario. Se recomienda una valoración profesional para cualquier procedimiento legal.",
    footerLine1: "Generado por SettleLens — Modelización de escenarios financieros para la preparación del divorcio | settlelens.com",
    footerLine2: "SettleLens proporciona modelización financiera solo con fines informativos. Esto no es asesoramiento legal, asesoramiento financiero ni un documento judicial. Las reglas de propiedad específicas de la jurisdicción se han aplicado solo como suposiciones. Verifique siempre con un abogado de familia calificado.",
    footerLine3: "Datos introducidos por el usuario — SettleLens no ha verificado independientemente ningún valor.",
    reportGenerated: "Informe generado",
    mo: "/mes",
    heldAt: "Custodiado en",
    qty: "Cantidad",
    token: "Token",
    assetAllocation: "Distribución de activos por escenario",
    mortgage: "Hipoteca / Préstamo",
    outcome: "Resultado",
    yourShare: "Su parte",
    maritalGainNote: "* Activos con precio de compra: la apreciación marital se calcula por separado según las normas jurisdiccionales aplicables.",
    financialAssetNote: "Activos financieros (banco/jubilación/inversiones) divididos al",
    lawyerEditionBadge: "Resumen financiero para su abogado",
    questionsForLawyer: "Preguntas para su abogado",
  },
  ar: {
    reportTitle: "تقرير التحليل المالي",
    preparedFor: "أُعدّ لـ",
    date: "التاريخ",
    jurisdiction: "الولاية القضائية",
    scenariosAnalyzed: "السيناريوهات المحللة",
    disclaimerTitle: "نمذجة مالية فقط — ليست نصيحة قانونية أو مالية",
    disclaimerBody: "هذا التقرير نظرة عامة مالية معدّة للمحامين لأغراض التخطيط الشخصي. لا يُشكّل نصيحة قانونية، ولا يتنبأ بنتائج المحكمة، ولا يضمن أي نتيجة تسوية. استشر دائماً محامياً متخصصاً في قانون الأسرة.",
    netWorthSummary: "ملخص صافي الثروة",
    totalAssets: "إجمالي الأصول",
    totalDebts: "إجمالي الديون",
    netWorth: "صافي الثروة",
    assets: "الأصول",
    debts: "الديون",
    name: "الاسم",
    category: "الفئة",
    currentValue: "القيمة الحالية",
    ownedBy: "المالك",
    balance: "الرصيد",
    monthlyPayment: "الدفعة الشهرية",
    scenarioAnalysis: "تحليل السيناريوهات",
    scenario: "السيناريو",
    metric: "المقياس",
    value: "القيمة",
    netWorthNow: "صافي الثروة الحالي",
    year1: "توقعات السنة 1",
    year3: "توقعات السنة 3",
    year5: "توقعات السنة 5",
    year10: "توقعات السنة 10",
    monthlyCashFlow: "التدفق النقدي الشهري",
    riskScore: "درجة المخاطرة",
    alimonyRange: "تقدير نطاق النفقة",
    childSupport: "تقدير نفقة الأطفال",
    keyRisks: "المخاطر الرئيسية",
    financialNote: "ملاحظة التموضع المالي",
    cryptoNotice: "تنبيه أصول التشفير",
    cryptoNoticeText: "قيم العملات المشفرة شديدة التقلب ومُعلنة من قِبل المستخدم. يُنصح بتقييم مهني لأي إجراءات قانونية.",
    footerLine1: "أُنشئ بواسطة SettleLens — نمذجة السيناريوهات المالية للتحضير للطلاق | settlelens.com",
    footerLine2: "تُقدم SettleLens نمذجة مالية للأغراض المعلوماتية فقط. هذا ليس نصيحة قانونية أو مالية أو وثيقة محكمة. تم تطبيق قواعد الملكية الخاصة بالولاية القضائية كافتراضات فقط. تحقق دائماً مع محامٍ متخصص في قانون الأسرة في ولايتك القضائية.",
    footerLine3: "البيانات مُدخلة من قِبل المستخدم — لم تتحقق SettleLens بشكل مستقل من أي قيم.",
    reportGenerated: "تم إنشاء التقرير",
    mo: "/شهر",
    heldAt: "محتفظ به في",
    qty: "الكمية",
    token: "الرمز",
    assetAllocation: "توزيع الأصول حسب السيناريو",
    mortgage: "الرهن العقاري / القرض",
    outcome: "النتيجة",
    yourShare: "حصتك",
    maritalGainNote: "* الأصول ذات سعر الشراء: تُحسب الزيادة الزوجية بشكل منفصل وفقاً للقواعد القانونية المعمول بها.",
    financialAssetNote: "الأصول المالية (البنك/التقاعد/الاستثمارات) مقسّمة بنسبة",
    lawyerEditionBadge: "نظرة مالية شاملة للمحامي",
    questionsForLawyer: "أسئلة لمحاميك",
  },
};

function fmt(n: number, currency: string, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function riskColor(score: number): string {
  if (score >= 7) return "#E85252";
  if (score >= 4) return "#C8973A";
  return "#4FA86E";
}

export function buildReportHTML(data: ReportData): string {
  const { userName, jurisdiction, date, lang, assets, debts, scenarios, currency, isLawyerEdition } = data;
  const safeUserName = escapeHtml(userName);
  const safeJurisdiction = escapeHtml(jurisdiction);
  const L = REPORT_LABELS[lang] ?? REPORT_LABELS.en;
  const isRtl = lang === "ar";
  const fmtL = (n: number) => fmt(n, currency, lang);

  const totalAssets = assets.reduce((s, a) => s + (a.current_value || 0), 0);
  const totalMortgages = assets.reduce((s, a) => s + (a.mortgage_balance ?? 0), 0);
  const totalDebts = debts.reduce((s, d) => s + (d.balance || 0), 0) + totalMortgages;
  const netWorth = totalAssets - totalDebts;

  const PHYSICAL_CATS_PDF = new Set(["real_estate", "vehicle", "business"]);
  const FINANCIAL_CATS_PDF = new Set(["bank", "retirement", "investment", "crypto", "other"]);

  const scenariosHTML = scenarios
    .map(
      (s, i) => {
        const scenarioAssets = s.assets ?? assets;
        const physicalAssets = scenarioAssets.filter((a) => PHYSICAL_CATS_PDF.has(a.category));
        const financialAssets = scenarioAssets.filter((a) => FINANCIAL_CATS_PDF.has(a.category));
        const splitPct = s.retirement_split_me ?? 50;
        const financialTotal = financialAssets.reduce((sum, a) => sum + (a.current_value ?? 0), 0);
        const hasPurchasePrice = physicalAssets.some((a) => a.purchase_price && a.purchase_price > 0);

        const assetBreakdownHTML = physicalAssets.length > 0 ? `
        <h4 style="font-size:11px;color:#1C2B3A;margin:12px 0 6px;text-transform:uppercase;letter-spacing:0.5px;">${L.assetAllocation}</h4>
        <table class="data-table" style="font-size:10px;">
          <tr>
            <th>${L.name}</th>
            <th>${L.currentValue}</th>
            <th>${L.mortgage}</th>
            <th>${L.outcome}</th>
            <th style="text-align:right;">${L.yourShare}</th>
          </tr>
          ${physicalAssets.map((a) => `<tr>
            <td>${escapeHtml(a.name)}</td>
            <td>${fmtL(a.current_value ?? 0)}</td>
            <td>${(a.mortgage_balance ?? 0) > 0 ? fmtL(a.mortgage_balance ?? 0) : "—"}</td>
            <td>${outcomeLabel(a.outcome, lang)}</td>
            <td style="text-align:right;font-weight:bold;">${fmtL(calcUserShare(a))}</td>
          </tr>`).join("")}
        </table>
        ${financialAssets.length > 0 ? `<p style="font-size:10px;color:#8B7355;margin-top:6px;">${L.financialAssetNote} ${splitPct}% → ${fmtL(financialTotal * splitPct / 100)}</p>` : ""}
        ${hasPurchasePrice ? `<p style="font-size:9px;color:#8B7355;margin-top:4px;font-style:italic;">${L.maritalGainNote}</p>` : ""}
        ` : "";

        return `
      <div class="scenario-block" style="break-inside:avoid;">
        <h3 style="color:#1C2B3A;border-bottom:2px solid #C8973A;padding-bottom:4px;">${L.scenario} ${i + 1}: ${escapeHtml(s.name)}</h3>
        <p style="font-size:11px;color:#6b6b6b;font-style:italic;margin-top:0;">${escapeHtml(s.confidence_label_text)}</p>
        ${assetBreakdownHTML}
        <table class="data-table">
          <tr><th>${L.metric}</th><th>${L.value}</th></tr>
          <tr><td>${L.netWorthNow}</td><td>${fmtL(s.net_worth_now)}</td></tr>
          <tr><td>${L.year1}</td><td>${fmtL(s.year1)}</td></tr>
          <tr><td>${L.year3}</td><td>${fmtL(s.year3)}</td></tr>
          <tr><td>${L.year5}</td><td>${fmtL(s.year5)}</td></tr>
          <tr><td>${L.year10}</td><td>${fmtL(s.year10)}</td></tr>
          <tr><td>${L.monthlyCashFlow}</td><td>${fmtL(s.monthly_cashflow)}${L.mo}</td></tr>
          <tr><td>${L.riskScore}</td><td style="color:${riskColor(s.risk_score)};font-weight:bold;">${s.risk_score}/10</td></tr>
          <tr><td>${L.alimonyRange}</td><td>${fmtL(s.alimony_range_low)} – ${fmtL(s.alimony_range_high)}${L.mo}</td></tr>
          <tr><td>${L.childSupport}</td><td>${fmtL(s.child_support_estimate)}${L.mo}</td></tr>
        </table>
        ${s.key_risks?.length ? `<p style="margin-top:10px;"><strong>${L.keyRisks}:</strong> ${(s.key_risks as string[]).map(escapeHtml).join("; ")}</p>` : ""}
        ${s.negotiation_strategy ? `<p style="margin-top:8px;"><strong>${L.financialNote}:</strong> ${escapeHtml(s.negotiation_strategy)}</p>` : ""}
        ${isLawyerEdition && (s as unknown as Record<string, unknown>).questions_for_your_lawyer
          ? (() => {
              const qs = (s as unknown as Record<string, unknown>).questions_for_your_lawyer as string[];
              if (!Array.isArray(qs) || qs.length === 0) return "";
              return `<div style="margin-top:12px;background:#F7F3EE;border-left:3px solid #C8973A;padding:10px 14px;border-radius:0 4px 4px 0;">
                <strong style="font-size:11px;color:#1C2B3A;">${L.questionsForLawyer}:</strong>
                <ul style="margin-top:6px;padding-left:16px;">
                  ${qs.map((q) => `<li style="font-size:10px;color:#2E4D6B;margin-bottom:4px;">${escapeHtml(q)}</li>`).join("")}
                </ul>
              </div>`;
            })()
          : ""}
      </div>`;
      }
    )
    .join("<hr style='margin:24px 0;border-color:#D4C5B0;'>");

  return `<!DOCTYPE html>
<html lang="${lang}" ${isRtl ? 'dir="rtl"' : ""}>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${isRtl ? "'Noto Sans Arabic', " : ""}'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #333; background: #fff; direction: ${isRtl ? "rtl" : "ltr"}; }
  .cover { background: #1C2B3A; color: #fff; padding: 40px; min-height: 200px; }
  .cover h1 { font-size: 28px; color: #C8973A; letter-spacing: 2px; }
  .cover h2 { font-size: 16px; color: #d0d0d0; margin-top: 8px; }
  .cover .meta { margin-top: 20px; font-size: 11px; color: #a0b0c0; line-height: 1.8; }
  .disclaimer-box { background: #FFF3F3; border: 2px solid #E85252; padding: 10px 14px; margin: 20px 0; border-radius: 4px; }
  .disclaimer-box p { color: #E85252; font-weight: bold; font-size: 11px; }
  h2 { font-size: 16px; color: #1C2B3A; margin: 20px 0 10px; }
  h3 { font-size: 13px; color: #1C2B3A; margin: 16px 0 8px; }
  .data-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
  .data-table th { background: #1C2B3A; color: #fff; padding: 6px 10px; text-align: ${isRtl ? "right" : "left"}; }
  .data-table td { padding: 5px 10px; border-bottom: 1px solid #e8e8e8; }
  .data-table tr:nth-child(even) td { background: #f7f3ee; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 12px 0; }
  .summary-card { border: 1px solid #D4C5B0; border-radius: 6px; padding: 12px; text-align: center; }
  .summary-card .label { font-size: 10px; color: #8B7355; text-transform: uppercase; letter-spacing: 0.5px; }
  .summary-card .value { font-size: 18px; font-weight: bold; color: #1C2B3A; margin-top: 4px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #D4C5B0; font-size: 9px; color: #999; }
  section { margin-bottom: 24px; }
</style>
</head>
<body>

<div class="cover">
  <h1>SettleLens</h1>
  <h2>${isLawyerEdition ? L.lawyerEditionBadge : L.reportTitle}</h2>
  <div class="meta">
    <div>${L.preparedFor}: ${safeUserName}</div>
    <div>${L.date}: ${date}</div>
    <div>${L.jurisdiction}: ${safeJurisdiction}</div>
    <div>${L.scenariosAnalyzed}: ${scenarios.length}</div>
    ${isLawyerEdition ? `<div style="margin-top:8px;font-size:10px;color:#C8973A;font-weight:bold;">★ LAWYER EDITION</div>` : ""}
  </div>
</div>

<div style="padding:0 2px;">

<div class="disclaimer-box">
  <p>${L.disclaimerTitle}</p>
  <p style="font-weight:normal;margin-top:4px;">${L.disclaimerBody}</p>
</div>

<section>
  <h2>${L.netWorthSummary}</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">${L.totalAssets}</div>
      <div class="value">${fmtL(totalAssets)}</div>
    </div>
    <div class="summary-card">
      <div class="label">${L.totalDebts}</div>
      <div class="value" style="color:#E85252;">${fmtL(totalDebts)}</div>
    </div>
    <div class="summary-card">
      <div class="label">${L.netWorth}</div>
      <div class="value" style="color:${netWorth >= 0 ? "#4FA86E" : "#E85252"};">${fmtL(netWorth)}</div>
    </div>
  </div>
</section>

<section>
  <h2>${L.assets}</h2>
  <table class="data-table">
    <tr><th>${L.name}</th><th>${L.category}</th><th>${L.currentValue}</th><th>${L.ownedBy}</th></tr>
    ${assets.map((a) => `<tr><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.category)}</td><td>${fmtL(a.current_value)}</td><td>${escapeHtml(a.owned_by)}</td></tr>`).join("")}
  </table>
  ${assets.some((a) => a.category === "crypto") ? `
  <div style="margin-top:10px;background:#FFF8E1;border:1px solid #F59E0B;border-radius:6px;padding:10px;font-size:11px;color:#92400E;">
    <strong>⚠ ${L.cryptoNotice}:</strong> ${L.cryptoNoticeText}
    ${assets.filter((a) => a.category === "crypto").map((a) => {
      const extra = [];
      if (a.crypto_token) extra.push(`${L.token}: ${escapeHtml(a.crypto_token)}`);
      if (a.crypto_quantity) extra.push(`${L.qty}: ${Number(a.crypto_quantity).toFixed(8)}`);
      if (a.crypto_exchange) extra.push(`${L.heldAt}: ${escapeHtml(a.crypto_exchange)}`);
      return `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #F59E0B;">${escapeHtml(a.name)}${extra.length ? " — " + extra.join(" | ") : ""}</div>`;
    }).join("")}
  </div>` : ""}
</section>

<section>
  <h2>${L.debts}</h2>
  <table class="data-table">
    <tr><th>${L.name}</th><th>${L.category}</th><th>${L.balance}</th><th>${L.monthlyPayment}</th><th>${L.ownedBy}</th></tr>
    ${debts.map((d) => `<tr><td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.category)}</td><td>${fmtL(d.balance)}</td><td>${fmtL(d.monthly_payment)}${L.mo}</td><td>${escapeHtml(d.owned_by ?? "—")}</td></tr>`).join("")}
  </table>
</section>

<section>
  <h2>${L.scenarioAnalysis}</h2>
  ${scenariosHTML}
</section>

<div class="footer">
  <p>${L.footerLine1}</p>
  <p style="margin-top:4px;">${L.footerLine2}</p>
  <p style="margin-top:4px;">${L.reportGenerated}: ${date} | ${L.footerLine3}</p>
</div>

</div>
</body>
</html>`;
}
