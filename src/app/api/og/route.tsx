import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "EventApp";
  const date = searchParams.get("date") ?? "";
  const venue = searchParams.get("venue") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          background: "linear-gradient(135deg, #4900cc 0%, #6134e3 50%, #8935b6 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "white",
            }}
          >
            E
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.02em",
            }}
          >
            EventApp
          </span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(date || venue) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "22px",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 500,
              }}
            >
              {date && <span>{date}</span>}
              {date && venue && <span style={{ opacity: 0.5 }}>|</span>}
              {venue && <span>{venue}</span>}
            </div>
          )}
          <h1
            style={{
              fontSize: title.length > 40 ? "48px" : "56px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
