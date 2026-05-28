import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/fr.json";

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M6LRP7BB');`,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V6D0B14RE1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-V6D0B14RE1');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M6LRP7BB" height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>
        <NextIntlClientProvider locale="fr" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
