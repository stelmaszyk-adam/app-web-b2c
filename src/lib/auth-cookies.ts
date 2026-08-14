export const COOKIE_ACCESS_TOKEN = "auth_token";
export const COOKIE_REFRESH_TOKEN = "auth_refresh";

export const TOS_VERSION = "2026-04-01";

export interface AuthUser {
  sub: string;
  email: string;
  displayName?: string;
}

function decodeBase64(str: string): string {
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/");
  if (typeof atob !== "undefined") return atob(normalized);
  return Buffer.from(normalized, "base64").toString("utf8");
}

export function isTokenExpired(token: string | undefined): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(decodeBase64(parts[1])) as Record<string, unknown>;
    return typeof payload.exp !== "number" || payload.exp * 1000 < Date.now() + 60_000;
  } catch {
    return true;
  }
}

export function decodeTokenUser(token: string | undefined): AuthUser | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(decodeBase64(parts[1])) as Record<string, unknown>;
    if (!payload.sub || !payload.email) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      displayName: payload.displayName ? String(payload.displayName) : undefined,
    };
  } catch {
    return null;
  }
}

export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
} as const;
