import json

additions = {
  "en": {
    "riskQuestion": "Do any of these apply to your situation?",
    "riskNote": "This helps us adjust our confidence level. It does not prevent you from continuing.",
    "riskTitle": "Professional Support May Be Required",
    "riskNotice": "This situation may require professional legal advice. SettleLens can help you organize financial scenarios, but please speak with a qualified lawyer or mediator before making any decisions.",
  },
  "tr": {
    "riskQuestion": "Durumunuza uyan bir durum var mı?",
    "riskNote": "Bu bilgi modelimizin güven seviyesini ayarlar. Devam etmenizi engellemez.",
    "riskTitle": "Profesyonel Destek Gerekebilir",
    "riskNotice": "Bu durum profesyonel hukuki destek gerektirebilir. SettleLens finansal senaryolarınızı düzenlemenize yardımcı olabilir, ancak herhangi bir karar vermeden önce nitelikli bir avukat veya arabulucuyla görüşmenizi öneririz.",
  },
  "de": {
    "riskQuestion": "Trifft eine dieser Situationen auf Sie zu?",
    "riskNote": "Dies hilft uns, unser Konfidenzniveau anzupassen. Es hindert Sie nicht daran, fortzufahren.",
    "riskTitle": "Professionelle Unterstützung kann erforderlich sein",
    "riskNotice": "Diese Situation erfordert möglicherweise professionellen Rechtsbeistand. SettleLens kann Ihnen helfen, finanzielle Szenarien zu organisieren, aber bitte sprechen Sie mit einem qualifizierten Anwalt oder Mediator, bevor Sie Entscheidungen treffen.",
  },
  "fr": {
    "riskQuestion": "L'une de ces situations s'applique-t-elle à votre cas?",
    "riskNote": "Cela nous aide à ajuster notre niveau de confiance. Cela ne vous empêche pas de continuer.",
    "riskTitle": "Un soutien professionnel peut être nécessaire",
    "riskNotice": "Cette situation peut nécessiter des conseils juridiques professionnels. SettleLens peut vous aider à organiser des scénarios financiers, mais veuillez consulter un avocat ou un médiateur qualifié avant de prendre des décisions.",
  },
  "es": {
    "riskQuestion": "¿Alguna de estas situaciones se aplica a tu caso?",
    "riskNote": "Esto nos ayuda a ajustar nuestro nivel de confianza. No te impide continuar.",
    "riskTitle": "Puede ser necesario apoyo profesional",
    "riskNotice": "Esta situación puede requerir asesoramiento legal profesional. SettleLens puede ayudarte a organizar escenarios financieros, pero consulta con un abogado o mediador calificado antes de tomar decisiones.",
  },
  "ar": {
    "riskQuestion": "هل ينطبق أي من هذه الأوضاع على حالتك؟",
    "riskNote": "يساعدنا هذا في ضبط مستوى ثقتنا. لا يمنعك من المتابعة.",
    "riskTitle": "قد يكون الدعم المهني ضروريًا",
    "riskNotice": "قد تستلزم هذه الحالة مشورة قانونية متخصصة. يمكن لـ SettleLens مساعدتك في تنظيم السيناريوهات المالية، لكن يرجى التحدث مع محامٍ أو وسيط مؤهل قبل اتخاذ أي قرارات.",
  },
}

base_path = "d:/girisimler/SettleLens/settlelens/messages"

for lang, keys in additions.items():
  filepath = f"{base_path}/{lang}.json"
  with open(filepath, "r", encoding="utf-8") as f:
    obj = json.load(f)
  obj["onboarding_form"]["step1"].update(keys)
  with open(filepath, "w", encoding="utf-8") as f:
    json.dump(obj, f, ensure_ascii=False, indent=2)
  print(f"Updated {lang}.json")

print("All done")
