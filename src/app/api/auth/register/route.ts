import { cookies } from "next/headers";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  SECURE_COOKIE_OPTIONS,
  decodeTokenUser,
} from "@/lib/auth-cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const resBody = await res.json().catch(() => null);

  if (!res.ok) {
    return Response.json(resBody ?? { error: "REGISTER_FAILED" }, {
      status: res.status,
    });
  }

  const data = (resBody?.data ?? resBody) as Record<string, unknown> | null;
  const accessToken = data?.accessToken as string | undefined;
  const refreshToken = data?.refreshToken as string | undefined;

  if (!accessToken || !refreshToken) {
    // Registration succeeded but no tokens — redirect to verify email
    return Response.json({ redirectTo: "/verify-email" });
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
  return Response.json({ user, redirectTo: "/verify-email" }, { status: 201 });
}
