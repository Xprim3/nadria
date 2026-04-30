import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const welcomeScript = Great_Vibes({
  variable: "--font-welcome",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pizzeria Adria Trier-Quint",
    template: "%s | Pizzeria Adria Trier-Quint",
  },
  description:
    "Authentische italienische Küche in Trier-Quint: Speisekarte, Öffnungszeiten, Reservierung, Lieferung und Kontakt.",
  applicationName: "Pizzeria Adria",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Pizzeria Adria Trier-Quint",
    locale: "de_DE",
    url: siteUrl,
    title: "Pizzeria Adria Trier-Quint",
    description:
      "Authentische italienische Küche in Trier-Quint: Speisekarte, Öffnungszeiten, Reservierung, Lieferung und Kontakt.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Pizzeria Adria Trier-Quint" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pizzeria Adria Trier-Quint",
    description:
      "Authentische italienische Küche in Trier-Quint: Speisekarte, Öffnungszeiten, Reservierung, Lieferung und Kontakt.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf7f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${welcomeScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf7f2] text-stone-900 font-sans">
        {children}
      </body>
    </html>
  );
}
