import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wydarzka - Odkrywaj wydarzenia w Twoim mieście",
    short_name: "Wydarzka",
    description:
      "Odkrywaj najlepsze wydarzenia w polskich miastach — koncerty, wystawy, festiwale i więcej.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4900cc",
    icons: [
      {
        src: "/icon/16",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icon/32",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon/192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon/512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
