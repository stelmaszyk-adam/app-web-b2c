import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  isTokenExpired,
} from "./lib/auth-cookies";

const handleI18nRouting = createMiddleware(routing);

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function buildAuthHeaders(token: string | undefined, base: Headers): Headers {
  if (!token) return base;
  const headers = new Headers(base);
  headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For /api/* paths — inject auth header so the rewrite can forward it to backend.
  // Our own Next.js route handlers under /api/auth/* will receive (and ignore) this
  // header safely; other /api/* calls are rewritten to the backend where it's needed.
  if (pathname.startsWith("/api/")) {
    const token = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    if (token && !isTokenExpired(token)) {
      const headers = buildAuthHeaders(token, request.headers);
      return NextResponse.next({ request: { headers } });
    }
    return NextResponse.next();
  }

  // For page requests: transparently refresh an expired access token.
  const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;

  if (refreshToken && isTokenExpired(accessToken)) {
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const body = (await refreshRes.json()) as Record<string, unknown>;
        const data = (body.data ?? body) as Record<string, unknown>;
        const newAccess = data.accessToken as string | undefined;
        const newRefresh = data.refreshToken as string | undefined;

        if (newAccess) {
          const response = handleI18nRouting(request);
          const secure = process.env.NODE_ENV === "production";

          response.cookies.set({
            name: COOKIE_ACCESS_TOKEN,
            value: newAccess,
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60,
          });
          if (newRefresh) {
            response.cookies.set({
              name: COOKIE_REFRESH_TOKEN,
              value: newRefresh,
              httpOnly: true,
              secure,
              sameSite: "lax",
              path: "/",
              maxAge: 30 * 24 * 60 * 60,
            });
          }
          return response;
        }
      } else {
        // Refresh failed — clear stale cookies and continue unauthenticated.
        const response = handleI18nRouting(request);
        response.cookies.delete(COOKIE_ACCESS_TOKEN);
        response.cookies.delete(COOKIE_REFRESH_TOKEN);
        return response;
      }
    } catch {
      // Network error — continue without refreshing.
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Include /api/* so we can inject auth headers before rewrites; exclude
  // Next.js internals and static assets.
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
