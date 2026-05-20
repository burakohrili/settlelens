import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://settlelens.com"),
  title: "SettleLens — See Your Settlement Clearly",
  description:
    "AI-powered financial modeling for divorce settlements. See your 10-year financial future across every scenario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
