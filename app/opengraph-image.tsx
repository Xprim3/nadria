import { ImageResponse } from "next/og";
import { BRAND_LOGO_SRC } from "@/lib/brand-logo";
import { getSiteUrl } from "@/lib/seo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const logoUrl = `${getSiteUrl()}${BRAND_LOGO_SRC}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background:
            "linear-gradient(135deg, #1c1917 0%, #450a0a 45%, #92400e 100%)",
          color: "#fff",
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img
            src={logoUrl}
            alt="Pizzeria Adria Logo"
            style={{
              width: 172,
              height: 108,
              objectFit: "contain",
            }}
          />
          <div style={{ fontSize: 34, letterSpacing: 3, opacity: 0.9 }}>
            PIZZERIA ADRIA
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            whiteSpace: "pre-line",
          }}
        >
          {"Authentische italienische\nKüche in Trier-Quint"}
        </div>
        <div style={{ fontSize: 30, opacity: 0.95 }}>
          Speisekarte • Öffnungszeiten • Reservierung • Lieferung
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
