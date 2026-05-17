export const HIGH_RISK_SIGNALS = [
  {
    key: "domestic_violence",
    label: { en: "Domestic violence or coercive control", tr: "Aile içi şiddet veya zorlayıcı kontrol", de: "Häusliche Gewalt oder Zwangskontrolle", fr: "Violence domestique ou contrôle coercitif", es: "Violencia doméstica o control coercitivo", ar: "عنف منزلي أو سيطرة قسرية" },
  },
  {
    key: "threats_stalking",
    label: { en: "Threats, stalking, or harassment", tr: "Tehdit, takip veya taciz", de: "Drohungen, Stalking oder Belästigung", fr: "Menaces, harcèlement ou traque", es: "Amenazas, acoso o persecución", ar: "التهديدات أو المطاردة أو المضايقة" },
  },
  {
    key: "hidden_assets",
    label: { en: "Concern about hidden or undisclosed assets", tr: "Gizlenmiş veya beyan edilmemiş varlık endişesi", de: "Verdacht auf versteckte Vermögenswerte", fr: "Actifs cachés ou non déclarés suspectés", es: "Preocupación por bienes ocultos o no declarados", ar: "مخاوف بشأن أصول مخفية أو غير مُفصح عنها" },
  },
  {
    key: "offshore_accounts",
    label: { en: "Offshore accounts or complex international assets", tr: "Offshore hesaplar veya karmaşık uluslararası varlıklar", de: "Offshore- oder ausländische Konten", fr: "Comptes offshore ou actifs internationaux complexes", es: "Cuentas offshore o activos internacionales complejos", ar: "حسابات خارجية أو أصول دولية معقدة" },
  },
  {
    key: "business_dispute",
    label: { en: "Business ownership dispute", tr: "İşletme sahipliği anlaşmazlığı", de: "Unternehmensstreit", fr: "Litige sur la propriété d'entreprise", es: "Disputa de propiedad empresarial", ar: "نزاع على ملكية الأعمال" },
  },
  {
    key: "complex_inheritance",
    label: { en: "Complex trust, inheritance, or pre-marital agreement", tr: "Karmaşık miras, tröst veya evlilik öncesi anlaşma", de: "Komplexe Erbschaft, Testament oder Ehevertrag", fr: "Succession, héritage ou contrat prénuptial complexe", es: "Herencia, fideicomiso o acuerdo prenupcial complejo", ar: "تراث أو وصايا أو عقد زواج معقد" },
  },
  {
    key: "custody_conflict",
    label: { en: "High-conflict child custody situation", tr: "Yüksek çatışmalı çocuk velayeti durumu", de: "Strittiges Sorgerecht", fr: "Garde d'enfant très conflictuelle", es: "Situación de custodia infantil de alto conflicto", ar: "حضانة أطفال عالية النزاع" },
  },
  {
    key: "immigration",
    label: { en: "Immigration status dependency on marriage", tr: "Evliliğe bağlı göçmenlik durumu", de: "Aufenthaltsstatus abhängig von der Ehe", fr: "Statut d'immigration dépendant du mariage", es: "Estatus migratorio dependiente del matrimonio", ar: "حالة الهجرة المرتبطة بالزواج" },
  },
  {
    key: "bankruptcy",
    label: { en: "Bankruptcy, significant tax debt, or financial fraud", tr: "İflas, önemli vergi borcu veya mali dolandırıcılık", de: "Insolvenz, erhebliche Steuerschulden oder Betrug", fr: "Faillite, dette fiscale importante ou fraude financière", es: "Quiebra, deuda tributaria significativa o fraude financiero", ar: "الإفلاس أو الديون الضريبية الكبيرة أو الاحتيال المالي" },
  },
  {
    key: "financial_disclosure_refusal",
    label: { en: "Spouse refuses to disclose financial information", tr: "Eş finansal bilgileri açıklamayı reddediyor", de: "Ehepartner verweigert Finanzauskunft", fr: "Conjoint refusant la divulgation financière", es: "Cónyuge que se niega a revelar información financiera", ar: "رفض الزوج الإفصاح المالي" },
  },
] as const;

export type HighRiskKey = (typeof HIGH_RISK_SIGNALS)[number]["key"];
