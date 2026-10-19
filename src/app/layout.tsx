import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: "500" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: "600" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Konta — Todo lo que pasa en tu negocio, en un solo lugar",
  description: site.description,
  openGraph: {
    title: "Konta — Todo lo que pasa en tu negocio, en un solo lugar",
    description: site.description,
    locale: "es_AR",
    type: "website",
  },
  icons: { icon: "/konta-logo-light.png" },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${geistMono.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
