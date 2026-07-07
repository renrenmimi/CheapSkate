import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { PrefsProvider } from "@/lib/prefs";
import { Nav } from "@/components/Nav";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CheapSkate — never pay sticker price",
  description:
    "Track live deals for your favorite brands, compare prices across retailers, and stack coupons + cashback portals + credit card rewards into one true net price.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${instrument.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <PrefsProvider>
          <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
              <Link href="/" className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold tracking-tight text-green-deep">
                  Cheap<span className="italic text-deal">Skate</span>
                </span>
                <span className="hidden text-xs text-ink-soft sm:inline">
                  never pay sticker price
                </span>
              </Link>
              <Nav />
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
          <footer className="border-t border-line py-6">
            <div className="mx-auto max-w-6xl px-5 text-xs leading-relaxed text-ink-soft">
              Rates and promotions are research-verified snapshots with source
              links and “last verified” dates; cashback portal rates change
              often — the live refresh (Claude + web search) re-checks them when
              an API key is configured. Card offers (Chase Offers, Amex Offers,
              Capital One Offers) are targeted per account: always confirm in
              your issuer’s app.
            </div>
          </footer>
        </PrefsProvider>
      </body>
    </html>
  );
}
