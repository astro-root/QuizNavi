import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "QuizNavi - 全国のクイズ大会を検索";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 90,
              height: 90,
              borderRadius: 24,
              background: "#f59e0b",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            🏆
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "white",
            }}
          >
            QuizNavi
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#cbd5e1",
          }}
        >
          全国のクイズ大会を検索
        </div>
      </div>
    ),
    { ...size }
  );
}
