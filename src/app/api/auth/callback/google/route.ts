import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  SECURE_COOKIE_OPTIONS,
  decodeTokenUser,
} from "@/lib/auth-cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code) {
    return Response.redirect(new URL("/login?error=oauth_no_code", request.url));
  }

  // Exchange the authorization code with the backend.
  const res = await fetch(`${API_BASE}/auth/oauth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    return Response.redirect(new URL("/login?error=oauth_failed", request.url));
  }

  const resBody = await res.json().catch(() => null);
  const data = (resBody?.data ?? resBody) as Record<string, unknown> | null;
  const accessToken = data?.accessToken as string | undefined;
  const refreshToken = data?.refreshToken as string | undefined;

  if (!accessToken || !refreshToken) {
    return Response.redirect(new URL("/login?error=oauth_no_tokens", request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_ACCESS_TOKEN,
    value: accessToken,
    ...SECURE_COOKIE_OPTIONS,
    maxAge: 15 * 60,
  });
  cookieStore.set({
    name: COOKIE_REFRESH_TOKEN,
    value: refreshToken,
    ...SECURE_COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60,
  });

  const user = decodeTokenUser(accessToken);
  // If this is a new account, redirect to email verification.
  const isNewAccount = (data?.isNewAccount as boolean | undefined) ?? false;

  // Use the state param as the post-login redirect target if it was set.
  let redirectTarget = "/";
  if (state) {
    try {
      const parsed = JSON.parse(atob(state)) as { next?: string };
      if (parsed.next && parsed.next.startsWith("/")) {
        redirectTarget = parsed.next;
      }
    } catch {
      // ignore malformed state
    }
  }

  if (isNewAccount || !user) {
    return Response.redirect(new URL("/verify-email", request.url));
  }

  return Response.redirect(new URL(redirectTarget, request.url));
}
