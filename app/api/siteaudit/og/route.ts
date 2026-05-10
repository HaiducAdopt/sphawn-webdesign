import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

function safeText(value: string | null) {
  return value?.slice(0, 80) || "yourwebsite.com";
}

function getLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs improvement";
  return "Poor";
}

function textNode(text: string, style: React.CSSProperties) {
  return React.createElement("div", { style: { display: "flex", ...style } }, text);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const domain = safeText(searchParams.get("domain"));
  const speed = Number(searchParams.get("speed") ?? 0);
  const ai = Number(searchParams.get("ai") ?? 0);

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "1200px",
          height: "630px",
          background: "#070A12",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          fontFamily: "Arial",
        },
      },
      textNode("Sphawn SiteAudit", {
        fontSize: 26,
        color: "#D4AF37",
        letterSpacing: "8px",
        textTransform: "uppercase",
      }),

      textNode("Website audit for", {
        marginTop: 36,
        fontSize: 68,
        fontWeight: 700,
      }),

      textNode(domain, {
        marginTop: 14,
        fontSize: 52,
        fontWeight: 700,
        color: "#D4AF37",
      }),

      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            gap: 28,
            marginTop: 60,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 28,
              padding: "30px",
              width: 270,
            },
          },
          textNode("Speed", {
            fontSize: 24,
            color: "rgba(255,255,255,0.55)",
          }),
          textNode(String(speed), {
            marginTop: 16,
            fontSize: 72,
            fontWeight: 700,
          }),
          textNode(getLabel(speed), {
            marginTop: 8,
            fontSize: 24,
            color: "#D4AF37",
          })
        ),

        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 28,
              padding: "30px",
              width: 270,
            },
          },
          textNode("AI SEO", {
            fontSize: 24,
            color: "rgba(255,255,255,0.55)",
          }),
          textNode(String(ai), {
            marginTop: 16,
            fontSize: 72,
            fontWeight: 700,
          }),
          textNode(getLabel(ai), {
            marginTop: 8,
            fontSize: 24,
            color: "#D4AF37",
          })
        )
      ),

      textNode("Audit by Sphawn.nl", {
        marginTop: "auto",
        fontSize: 26,
        color: "rgba(255,255,255,0.55)",
      })
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}