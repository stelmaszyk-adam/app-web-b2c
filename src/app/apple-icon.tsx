import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#4900cc",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20%",
        }}
      >
        <span
          style={{
            fontSize: 99,
            fontWeight: 700,
            color: "white",
            lineHeight: 1,
          }}
        >
          E
        </span>
      </div>
    ),
    { ...size },
  );
}
