import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #1c1917 0%, #450a0a 45%, #92400e 100%)",
          color: "#fff",
          padding: "56px 64px",
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 3, opacity: 0.9 }}>
          PIZZERIA ADRIA
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 78,
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
