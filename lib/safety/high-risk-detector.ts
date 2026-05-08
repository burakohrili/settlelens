export const HIGH_RISK_SIGNALS = [
  {
    key: "domestic_violence",
    label: { en: "Domestic violence or coercive control", tr: "Aile içi şiddet veya zorlama", de: "Häusliche Gewalt oder Zwangskontrolle", fr: "Violence domestique ou contrôle coercitif", es: "Violencia doméstica o control coercitivo", ar: "عنف منزلي أو سيطرة قسرية" },
  },
  {
    key: "hidden_assets",
    label: { en: "Suspected hidden assets", tr: "Gizlendiğinden şüphelenilen varlıklar", de: "Verdacht auf versteckte Vermögenswerte", fr: "Actifs cachés suspectés", es: "Bienes ocultos sospechados", ar: "أصول مخفية مشتبه بها" },
  },
  {
    key: "offshore_accounts",
    label: { en: "Offshore or foreign accounts", tr: "Offshore veya yurt dışı hesaplar", de: "Offshore- oder ausländische Konten", fr: "Comptes offshore ou étrangers", es: "Cuentas offshore o extranjeras", ar: "حسابات خارجية أو أجنبية" },
  },
  {
    key: "business_dispute",
    label: { en: "Business ownership dispute", tr: "İşletme ortaklığı anlaşmazlığı", de: "Unternehmensstreit", fr: "Litige sur la propriété d'entreprise", es: "Disputa de propiedad empresarial", ar: "نزاع على ملكية الأعمال" },
  },
  {
    key: "custody_conflict",
    label: { en: "Contested child custody", tr: "Çekişmeli çocuk velayeti", de: "Strittiges Sorgerecht", fr: "Garde d'enfant contestée", es: "Custodia infantil disputada", ar: "حضانة الأطفال المتنازع عليها" },
  },
  {
    key: "threats_stalking",
    label: { en: "Threats, stalking, or harassment", tr: "Tehdit, takip veya taciz", de: "Drohungen, Stalking oder Belästigung", fr: "Menaces, harcèlement ou traque", es: "Amenazas, acoso o persecución", ar: "التهديدات أو المطاردة أو المضايقة" },
  },
  {
    key: "complex_inheritance",
    label: { en: "Complex trust, inheritance, or agreements", tr: "Karmaşık miras, vasiyetname veya sözleşmeler", de: "Komplexe Erbschaft, Testament oder Vereinbarungen", fr: "Succession, héritage ou accords complexes", es: "Herencia, fideicomiso o acuerdos complejos", ar: "تراث أو وصايا أو اتفاقيات معقدة" },
  },
  {
    key: "financial_disclosure_refusal",
    label: { en: "Spouse refusing financial disclosure", tr: "Eşin mali bildirimden kaçınması", de: "Ehepartner verweigert Finanzauskunft", fr: "Conjoint refusant la divulgation financière", es: "Cónyuge que se niega a revelar información financiera", ar: "رفض الزوج الإفصاح المالي" },
  },
] as const;

export type HighRiskKey = (typeof HIGH_RISK_SIGNALS)[number]["key"];
