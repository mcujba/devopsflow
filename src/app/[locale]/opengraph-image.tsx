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
          padding: 36,
          background: "#23282b",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            borderRadius: 10,
            border: "2px solid #b3aa96",
            background: "#ece5d5",
            color: "#2b2722",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#5f574b" }}>
            DEVOPS<span style={{ color: "#a8321a" }}>FLOW</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
              Infrastructure that stays up, deploys that ship faster.
            </div>
            <div style={{ marginTop: 26, fontSize: 30, color: "#5f574b" }}>
              Maxim Cujba · Senior DevOps Engineer
            </div>
          </div>
          <div style={{ display: "flex", height: 8, width: 120, background: "#a8321a" }} />
        </div>
      </div>
    ),
    size,
  );
}
