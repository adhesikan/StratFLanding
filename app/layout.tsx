import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-5FJHHFSH";

export const metadata: Metadata = {
  title: "Strategy Fundamentals | Rules-Based Stock Trade Ideas",
  description:
    "Strategy Fundamentals delivers rules-based stock trade ideas with a dashboard, push notifications, and historical backtests for educational purposes.",
  openGraph: {
    title: "Strategy Fundamentals",
    description:
      "Rules-based stock trade ideas delivered to your dashboard with push alerts. Educational, transparent, and backtest-driven.",
    url: "https://www.strategyfundamentals.com",
    siteName: "Strategy Fundamentals",
    type: "website"
  },
  metadataBase: new URL("https://www.strategyfundamentals.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
