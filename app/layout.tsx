import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1C2B3A",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://settlelens.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  title: "SettleLens — See Your Settlement Clearly",
  description:
    "AI-powered financial modeling for divorce settlements. See your 10-year financial future across every scenario.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    images: [{ url: "https://settlelens.com/og-image.png", width: 1200, height: 630, alt: "SettleLens — See Your Settlement Clearly" }],
    type: "website",
    siteName: "SettleLens",
  },
  twitter: {
    card: "summary_large_image",
    site: "@settlelens",
    creator: "@settlelens",
    images: ["https://settlelens.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SettleLens",
            url: "https://settlelens.com",
            logo: "https://settlelens.com/og-image.png",
            contactPoint: {
              "@type": "ContactPoint",
              email: "hello@settlelens.com",
              contactType: "customer service",
            },
            sameAs: [],
          }),
        }}
      />
      {children}
    </>
  );
}
