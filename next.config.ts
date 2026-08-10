import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  images: {
    // Event images are hotlinked from many different scraped sources (city
    // portals, ticketing sites, Google Places, arbitrary venue websites via
    // JSON-LD), so the source hostname isn't known ahead of time. Allow any
    // HTTPS host rather than maintaining an allowlist that breaks every time
    // a new import source is added.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const analyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withSentryConfig(analyze(withNextIntl(nextConfig)), {
  org: process.env.SENTRY_ORG ?? "wydarzka",
  project: process.env.SENTRY_PROJECT ?? "wydarzka-web-b2c",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  tunnelRoute: "/sentry-tunnel",
  widenClientFileUpload: true,
  disableLogger: true,
});
