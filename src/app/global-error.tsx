/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html className={`${inter.variable} antialiased`}>
      <body
        className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8fb] px-4 py-16"
        style={{ fontFamily: "var(--font-inter), sans-serif", color: "#10101e" }}
      >
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: "#fce4ec" }}>
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#d32f2f"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold tracking-tight">
          Cos poszlo nie tak
        </h1>
        <p className="mb-8 max-w-md text-center text-base" style={{ color: "#6c6c88" }}>
          Wystapil nieoczekiwany blad. Sprobuj ponownie lub wroc na strone glowna.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#6c3feb" }}
          >
            Sprobuj ponownie
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors"
            style={{ borderColor: "#dcdce8" }}
          >
            Strona glowna
          </a>
        </div>
      </body>
    </html>
  );
}
