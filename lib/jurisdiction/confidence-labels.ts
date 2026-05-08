export type ConfidenceLabel =
  | "formula-based-estimate"
  | "scenario-model"
  | "requires-professional-review"
  | "limited-confidence";

const COUNTRY_DEFAULTS: Record<string, ConfidenceLabel> = {
  "us-community": "formula-based-estimate",
  "us-equitable": "scenario-model",
  uk: "scenario-model",
  de: "formula-based-estimate",
  fr: "formula-based-estimate",
  es: "formula-based-estimate",
  tr: "formula-based-estimate",
};

export function getConfidenceLabel(
  jurisdiction: string,
  hasHighRiskSignals: boolean,
  missingDataFields: string[]
): ConfidenceLabel {
  if (hasHighRiskSignals) return "requires-professional-review";
  if (missingDataFields.length > 2) return "limited-confidence";
  return COUNTRY_DEFAULTS[jurisdiction] ?? "scenario-model";
}

export const CONFIDENCE_LABEL_COPY: Record<ConfidenceLabel, Record<string, string>> = {
  "formula-based-estimate": {
    en: "Formula-based estimate — based on statutory property division rules",
    tr: "Formüle dayalı tahmin — yasal mal paylaşımı kurallarına göre",
    de: "Formelbasierte Schätzung — basierend auf gesetzlichen Güterrechtsregeln",
    fr: "Estimation basée sur une formule — règles légales de partage des biens",
    es: "Estimación basada en fórmula — reglas legales de división de bienes",
    ar: "تقدير قائم على صيغة — بناءً على قواعد تقسيم الممتلكات القانونية",
  },
  "scenario-model": {
    en: "Scenario model — judicial discretion applies; outcome varies by case",
    tr: "Senaryo modeli — yargısal takdir geçerlidir; sonuç davadan davaya değişir",
    de: "Szenariomodell — richterliches Ermessen; Ergebnis variiert je nach Fall",
    fr: "Modèle de scénario — pouvoir discrétionnaire judiciaire; résultat variable",
    es: "Modelo de escenario — discreción judicial; resultado varía por caso",
    ar: "نموذج سيناريو — السلطة التقديرية للقضاء تنطبق؛ النتيجة تختلف حسب الحالة",
  },
  "requires-professional-review": {
    en: "Professional review recommended — complex factors detected in your inputs",
    tr: "Profesyonel inceleme önerilir — girişlerinizde karmaşık faktörler tespit edildi",
    de: "Professionelle Überprüfung empfohlen — komplexe Faktoren erkannt",
    fr: "Révision professionnelle recommandée — facteurs complexes détectés",
    es: "Revisión profesional recomendada — factores complejos detectados",
    ar: "يُنصح بمراجعة مهنية — تم اكتشاف عوامل معقدة في مدخلاتك",
  },
  "limited-confidence": {
    en: "Limited confidence — some key financial data is missing",
    tr: "Sınırlı güven — bazı önemli finansal veriler eksik",
    de: "Begrenzte Konfidenz — einige wichtige Finanzdaten fehlen",
    fr: "Confiance limitée — certaines données financières clés manquent",
    es: "Confianza limitada — faltan algunos datos financieros clave",
    ar: "ثقة محدودة — بعض البيانات المالية الرئيسية مفقودة",
  },
};
