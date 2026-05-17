import json

translations = {
  "en": {
    "title": "Cookie Policy",
    "intro": "This page explains how SettleLens uses cookies. You can change your cookie preferences at any time.",
    "essential_title": "Essential Cookies (Always Active)",
    "analytics_title": "Analytics Cookies (Consent Required)",
    "marketing_title": "Marketing Cookies",
    "manage_title": "Manage Your Preferences",
    "col_purpose": "Purpose",
    "col_duration": "Duration",
    "col_type": "Type",
    "sb_purpose": "Supabase session",
    "sb_duration": "Session",
    "consent_purpose": "Cookie preference",
    "consent_duration": "1 year",
    "ph_purpose": "PostHog analytics",
    "ph_duration": "1 year",
    "marketing_not_used": "✓ Not used",
    "manage_p": "You can update your preferences via the cookie banner at the bottom of the page, or by clearing 'sl_cookie_consent' from localStorage."
  },
  "tr": {
    "title": "Çerez Politikası",
    "intro": "Bu sayfa SettleLens'ın çerez kullanımını açıklar. Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz.",
    "essential_title": "Zorunlu Çerezler (Her Zaman Aktif)",
    "analytics_title": "Analitik Çerezler (Onay Gerekli)",
    "marketing_title": "Pazarlama Çerezleri",
    "manage_title": "Tercihlerinizi Değiştirin",
    "col_purpose": "Amaç",
    "col_duration": "Süre",
    "col_type": "Tür",
    "sb_purpose": "Supabase oturumu",
    "sb_duration": "Oturum",
    "consent_purpose": "Çerez tercihi",
    "consent_duration": "1 yıl",
    "ph_purpose": "PostHog analitik",
    "ph_duration": "1 yıl",
    "marketing_not_used": "✓ Kullanılmıyor",
    "manage_p": "Sayfanın alt kısmındaki çerez banner'ından tercihlerinizi güncelleyebilirsiniz. localStorage'dan 'sl_cookie_consent' anahtarını silerek de sıfırlayabilirsiniz."
  },
  "de": {
    "title": "Cookie-Richtlinie",
    "intro": "Diese Seite erklärt die Cookie-Verwendung von SettleLens. Sie können Ihre Cookie-Einstellungen jederzeit ändern.",
    "essential_title": "Notwendige Cookies (immer aktiv)",
    "analytics_title": "Analyse-Cookies (Einwilligung erforderlich)",
    "marketing_title": "Marketing-Cookies",
    "manage_title": "Einstellungen ändern",
    "col_purpose": "Zweck",
    "col_duration": "Dauer",
    "col_type": "Art",
    "sb_purpose": "Supabase-Sitzung",
    "sb_duration": "Sitzung",
    "consent_purpose": "Cookie-Einstellung",
    "consent_duration": "1 Jahr",
    "ph_purpose": "PostHog Analyse",
    "ph_duration": "1 Jahr",
    "marketing_not_used": "✓ Nicht verwendet",
    "manage_p": "Sie können Ihre Einstellungen über das Cookie-Banner am unteren Seitenrand aktualisieren."
  },
  "fr": {
    "title": "Politique de cookies",
    "intro": "Cette page explique comment SettleLens utilise les cookies. Vous pouvez modifier vos préférences à tout moment.",
    "essential_title": "Cookies essentiels (toujours actifs)",
    "analytics_title": "Cookies analytiques (consentement requis)",
    "marketing_title": "Cookies marketing",
    "manage_title": "Gérer vos préférences",
    "col_purpose": "Finalité",
    "col_duration": "Durée",
    "col_type": "Type",
    "sb_purpose": "Session Supabase",
    "sb_duration": "Session",
    "consent_purpose": "Préférence cookies",
    "consent_duration": "1 an",
    "ph_purpose": "Analytiques PostHog",
    "ph_duration": "1 an",
    "marketing_not_used": "✓ Non utilisés",
    "manage_p": "Vous pouvez mettre à jour vos préférences via la bannière de cookies en bas de page."
  },
  "es": {
    "title": "Política de cookies",
    "intro": "Esta página explica cómo SettleLens usa las cookies. Puedes cambiar tus preferencias en cualquier momento.",
    "essential_title": "Cookies esenciales (siempre activas)",
    "analytics_title": "Cookies analíticas (consentimiento requerido)",
    "marketing_title": "Cookies de marketing",
    "manage_title": "Gestionar preferencias",
    "col_purpose": "Propósito",
    "col_duration": "Duración",
    "col_type": "Tipo",
    "sb_purpose": "Sesión de Supabase",
    "sb_duration": "Sesión",
    "consent_purpose": "Preferencia de cookies",
    "consent_duration": "1 año",
    "ph_purpose": "Analíticas PostHog",
    "ph_duration": "1 año",
    "marketing_not_used": "✓ No utilizadas",
    "manage_p": "Puede actualizar sus preferencias a través del banner de cookies en la parte inferior de la página."
  },
  "ar": {
    "title": "سياسة ملفات تعريف الارتباط",
    "intro": "تشرح هذه الصفحة كيفية استخدام SettleLens لملفات تعريف الارتباط. يمكنك تغيير تفضيلاتك في أي وقت.",
    "essential_title": "ملفات تعريف الارتباط الأساسية (نشطة دائماً)",
    "analytics_title": "ملفات تعريف الارتباط التحليلية (تتطلب الموافقة)",
    "marketing_title": "ملفات تعريف الارتباط التسويقية",
    "manage_title": "إدارة تفضيلاتك",
    "col_purpose": "الغرض",
    "col_duration": "المدة",
    "col_type": "النوع",
    "sb_purpose": "جلسة Supabase",
    "sb_duration": "جلسة",
    "consent_purpose": "تفضيل ملفات تعريف الارتباط",
    "consent_duration": "سنة واحدة",
    "ph_purpose": "تحليلات PostHog",
    "ph_duration": "سنة واحدة",
    "marketing_not_used": "✓ غير مستخدمة",
    "manage_p": "يمكنك تحديث تفضيلاتك عبر شريط ملفات تعريف الارتباط في أسفل الصفحة."
  }
}

base_path = "d:/girisimler/SettleLens/settlelens/messages"

for lang, data in translations.items():
  filepath = f"{base_path}/{lang}.json"
  with open(filepath, "r", encoding="utf-8") as f:
    obj = json.load(f)
  obj["cookie_policy"] = data
  with open(filepath, "w", encoding="utf-8") as f:
    json.dump(obj, f, ensure_ascii=False, indent=2)
  print(f"Updated {lang}.json")

print("All done")
