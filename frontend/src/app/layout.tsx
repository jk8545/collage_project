import type { Metadata } from "next";
import DuckChatbot from '@/components/DuckChatbot';
import Link from 'next/link';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriVision Platform",
  description: "Food intelligence and OCR analysis platform",
  other: {
    google: "notranslate",
  },
};

import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className="notranslate">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <nav className="sticky top-0 z-50 bg-nv-bg-900/85 backdrop-blur-md border-b" style={{ borderColor: 'var(--nv-b1)' }}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="font-syne text-2xl font-bold tracking-tight">
                <span className="text-nv-t1">Nutri</span>
                <span className="text-nv-green">Vision</span>
              </Link>
              <div className="font-dm text-sm flex gap-6 items-center">
                <Link href="/" className="text-nv-t2 hover:text-nv-green transition">Scanner</Link>
                <Link href="/dashboard" className="text-nv-t2 hover:text-nv-green transition">Dashboard</Link>
                <Link href="/history" className="text-nv-t2 hover:text-nv-green transition">History</Link>
              </div>
            </div>
          </nav>
          {children}
          <DuckChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
