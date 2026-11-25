import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ShopProvider } from "@/components/ShopProvider";
import "./globals.css";

// Self-hosted at build time: no requests to Google from the visitor's browser.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const kufi = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "600"], variable: "--font-kufi", display: "swap" });

export const metadata: Metadata = {
  title: "FAIRFAX DXB CONCEPT — Straight heat from the streets",
  description: "Fairfax DXB concept — authentic sneakers, streetwear and collectibles in Dubai, UAE.",
  // concept redesign: keep it out of search results so it never competes with the real store
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#070b1f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${geistMono.variable} ${kufi.variable}`}>
      <body>
        <SmoothScroll>
          <ShopProvider>{children}</ShopProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
