import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Eduvents | The Home of Education Events",
    template: "%s",
  },
  description:
    "Explore our platform for education events. Find workshops, seminars, conferences, and CPD to enhance your learning and professional growth.",
  metadataBase: new URL("https://eduvents.co.uk"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VCZ75NPDE0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VCZ75NPDE0');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
