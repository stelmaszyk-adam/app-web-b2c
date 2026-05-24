import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "EventApp - Odkryj wydarzenia w Twoim mieście",
  description:
    "Odkryj najlepsze wydarzenia w polskich miastach. Koncerty, wystawy, festiwale i więcej.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
