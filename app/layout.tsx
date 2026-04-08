import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zira Fashions \u2014 UK & US Highstreet Brands, Lagos",
    template: "%s | Zira Fashions",
  },
  description:
    "Home for brand new & pre-owned UK and US highstreet fashion. Denim dresses, jumpsuits, playsuits. Nationwide delivery. DM to order.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://zirafashions.com"
  ),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Zira Fashions",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans bg-background text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
