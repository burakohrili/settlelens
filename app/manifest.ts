import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SettleLens",
    short_name: "SettleLens",
    description: "Financial modeling for divorce settlements",
    start_url: "/en",
    display: "standalone",
    background_color: "#1C2B3A",
    theme_color: "#1C2B3A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
