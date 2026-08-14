import { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return Response.redirect(new URL("/verify-email?error=missing_token", request.url));
  }

  const res = await fetch(
    `${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`,
    { method: "POST" },
  );

  if (!res.ok) {
    return Response.redirect(new URL("/verify-email?error=invalid_token", request.url));
  }

  return Response.redirect(new URL("/?verified=1", request.url));
}
