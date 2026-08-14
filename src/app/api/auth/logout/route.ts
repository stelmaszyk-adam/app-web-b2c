import { cookies } from "next/headers";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/lib/auth-cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;

  // Best-effort: tell the backend to revoke the refresh token.
  if (refreshToken) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get(COOKIE_ACCESS_TOKEN)?.value ?? ""}`,
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {
      // Network errors are non-fatal; we still clear local cookies.
    });
  }

  // Clear auth cookies regardless of backend response.
  cookieStore.delete(COOKIE_ACCESS_TOKEN);
  cookieStore.delete(COOKIE_REFRESH_TOKEN);

  // Determine redirect target from request body if provided.
  const body = await request.json().catch(() => null) as { redirectTo?: string } | null;
  const redirectTo = body?.redirectTo ?? "/";

  return Response.json({ redirectTo });
}
