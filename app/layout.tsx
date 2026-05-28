import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

const GTM_ID = "GTM-M6LRP7BB";
const GA_ID = "G-V6D0B14RE1";

export const viewport: Viewport = {
  themeColor: "#1C2B3A",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://settlelens.com"),
  title: "SettleLens — See Your Settlement Clearly",
  description:
    "AI-powered financial modeling for divorce settlements. See your 10-year financial future across every scenario.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    site: "@settlelens",
    creator: "@settlelens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script id="gtm" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      {children}
    </>
  );
}
