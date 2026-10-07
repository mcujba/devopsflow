import { ImageResponse } from "next/og";

export const alt = "DevOpsFlow — Maxim Cujba, Senior DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin-only text on purpose: the default font has no Cyrillic glyphs.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0f0f11",
          color: "#f6f5f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              marginRight: 18,
              backgroundImage: "linear-gradient(90deg, #f0060b, #cc26d5, #7702ff)",
            }}
          />
          DevOpsFlow
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            Reliability meets delivery speed
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#a3a2a9" }}>
            Maxim Cujba · Senior DevOps Engineer · Kubernetes · CI/CD · Cloud
          </div>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 5,
            backgroundImage: "linear-gradient(90deg, #f0060b, #cc26d5, #7702ff)",
          }}
        />
      </div>
    ),
    size,
  );
}
