import { ImageResponse } from "next/og";

export function generateImageMetadata() {
  return [
    { id: "16", size: { width: 16, height: 16 }, contentType: "image/png" },
    { id: "32", size: { width: 32, height: 32 }, contentType: "image/png" },
    { id: "192", size: { width: 192, height: 192 }, contentType: "image/png" },
    { id: "512", size: { width: 512, height: 512 }, contentType: "image/png" },
  ];
}

export default async function Icon({
  id,
}: {
  id: Promise<string | number>;
}) {
  const iconId = await id;
  const size = Number(iconId);

  const letterSize = Math.round(size * 0.55);

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
          borderRadius: size >= 192 ? "20%" : "0%",
        }}
      >
        <span
          style={{
            fontSize: letterSize,
            fontWeight: 700,
            color: "white",
            lineHeight: 1,
          }}
        >
          E
        </span>
      </div>
    ),
    { width: size, height: size },
  );
}
