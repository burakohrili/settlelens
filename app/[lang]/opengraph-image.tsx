import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SettleLens — See Your Settlement Clearly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINES: Record<string, string> = {
  en: "See Your Settlement Clearly",
  tr: "Uzlaşmanızı Netleştirin",
  de: "Sehen Sie Ihren Vergleich klar",
  fr: "Visualisez clairement votre accord",
  es: "Vea claramente su acuerdo",
  ar: "افهم تسويتك بوضوح",
};

const SUBTITLES: Record<string, string> = {
  en: "Financial modeling for divorce settlements · Not legal advice",
  tr: "Boşanma uzlaşması için finansal modelleme · Hukuki tavsiye değil",
  de: "Finanzmodellierung für Scheidungsvergleiche · Kein Rechtsrat",
  fr: "Modélisation financière · Pas un conseil juridique",
  es: "Modelización financiera · No es asesoramiento legal",
  ar: "نمذجة مالية لتسويات الطلاق · ليست استشارة قانونية",
};

type Props = { params: Promise<{ lang: string }> };

export default async function OGImage({ params }: Props) {
  const { lang } = await params;
  const tagline = TAGLINES[lang] ?? TAGLINES.en;
  const subtitle = SUBTITLES[lang] ?? SUBTITLES.en;
  const isRtl = lang === "ar";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#1C2B3A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 60px",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "#C8973A",
            borderRadius: "2px",
            marginBottom: "32px",
          }}
        />

        {/* Logo / Brand */}
        <div
          style={{
            color: "#C8973A",
            fontSize: "88px",
            fontWeight: 700,
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          SettleLens
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#F7F3EE",
            fontSize: "40px",
            marginTop: "28px",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.3,
          }}
        >
          {tagline}
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: "#8B7355",
            fontSize: "22px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>

        {/* URL badge */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: isRtl ? undefined : "60px",
            left: isRtl ? "60px" : undefined,
            color: "#2E4D6B",
            fontSize: "20px",
            letterSpacing: "0.5px",
          }}
        >
          settlelens.com
        </div>
      </div>
    ),
    { ...size }
  );
}
