import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4900cc" },
    { media: "(prefers-color-scheme: dark)", color: "#4900cc" },
  ],
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
