import { cookies } from "next/headers";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  SECURE_COOKIE_OPTIONS,
} from "@/lib/auth-cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return Response.json({ error: "NO_REFRESH_TOKEN" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const resBody = await res.json().catch(() => null);

  if (!res.ok) {
    cookieStore.delete(COOKIE_ACCESS_TOKEN);
    cookieStore.delete(COOKIE_REFRESH_TOKEN);
    return Response.json(resBody ?? { error: "REFRESH_FAILED" }, {
      status: res.status,
    });
  }

  const data = (resBody?.data ?? resBody) as Record<string, unknown> | null;
  const accessToken = data?.accessToken as string | undefined;
  const newRefreshToken = (data?.refreshToken as string | undefined) ?? refreshToken;

  if (!accessToken) {
    return Response.json({ error: "TOKEN_MISSING" }, { status: 500 });
  }

  cookieStore.set({
    name: COOKIE_ACCESS_TOKEN,
    value: accessToken,
    ...SECURE_COOKIE_OPTIONS,
    maxAge: 15 * 60,
  });
  cookieStore.set({
    name: COOKIE_REFRESH_TOKEN,
    value: newRefreshToken,
    ...SECURE_COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60,
  });

  return Response.json({ ok: true });
}
