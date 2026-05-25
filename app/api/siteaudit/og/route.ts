import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

function safeText(value: string | null, fallback = "-") {
  return value?.slice(0, 90) || fallback;
}

function safeScore(value: string | null) {
  const score = Number(value ?? 0);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs improvement";
  return "Poor";
}

function getAccent(score: number) {
  if (score >= 90) return "#31E981";
  if (score >= 70) return "#D4AF37";
  if (score >= 50) return "#FFB020";
  return "#FF5C7A";
}

function textNode(text: string, style: React.CSSProperties) {
  return React.createElement(
    "div",
    { style: { display: "flex", ...style } },
    text
  );
}

function metricCard(label: string, value: string, accent = "#D4AF37") {
  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        borderRadius: 20,
        padding: "14px 12px",
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.1)",
      },
    },
    textNode(label, {
      fontSize: 14,
      color: "rgba(255,255,255,0.45)",
      letterSpacing: "1px",
      textTransform: "uppercase",
    }),
    textNode(value, {
      marginTop: 8,
      fontSize: 23,
      fontWeight: 700,
      color: accent,
    })
  );
}

function scoreCard(label: string, score: number) {
  const accent = getAccent(score);

  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        borderRadius: 24,
        padding: "18px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
        border: "1px solid rgba(255,255,255,0.11)",
        minWidth: 0,
        flex: 1,
      },
    },
    textNode(label, {
      fontSize: 18,
      color: "rgba(255,255,255,0.58)",
    }),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 12,
        },
      },
      textNode(String(score), {
        fontSize: 46,
        lineHeight: 1,
        fontWeight: 800,
        color: "#FFFFFF",
      }),
      textNode(getLabel(score), {
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        color: accent,
        background: "rgba(255,255,255,0.07)",
        whiteSpace: "nowrap",
      })
    )
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const domain = safeText(searchParams.get("domain"), "yourwebsite.com");

  const overall = safeScore(searchParams.get("overall"));
  const speed = safeScore(searchParams.get("speed"));
  const seo = safeScore(searchParams.get("seo"));
  const accessibility = safeScore(searchParams.get("accessibility"));
  const bestPractices = safeScore(searchParams.get("bestPractices"));
  const ai = safeScore(searchParams.get("ai"));

  const fcp = safeText(searchParams.get("fcp"));
  const lcp = safeText(searchParams.get("lcp"));
  const cls = safeText(searchParams.get("cls"));
  const tbt = safeText(searchParams.get("tbt"));
  const speedIndex = safeText(searchParams.get("speedIndex"));

  const overallAccent = getAccent(overall);

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "1200px",
          height: "630px",
          position: "relative",
          overflow: "hidden",
          background: "#070A12",
          color: "white",
          display: "flex",
          fontFamily: "Arial",
        },
      },

      React.createElement("div", {
        style: {
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "999px",
          background: "rgba(0,225,240,0.10)",
          filter: "blur(120px)",
          top: -190,
          right: -150,
        },
      }),

      React.createElement("div", {
        style: {
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "999px",
          background: "rgba(151,71,255,0.14)",
          filter: "blur(120px)",
          bottom: -210,
          left: -140,
        },
      }),

      React.createElement(
        "div",
        {
          style: {
            position: "relative",
            zIndex: 2,
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "54px 58px",
            gap: 26,
          },
        },

        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              width: 350,
              minWidth: 350,
            },
          },

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 16,
              },
            },

            React.createElement(
              "div",
              {
                style: {
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#070A12",
                  fontWeight: 900,
                  fontSize: 30,
                },
              },
              "S"
            ),

            textNode("Sphawn SiteAudit", {
              fontSize: 26,
              fontWeight: 700,
            })
          ),

          textNode("Website audit report", {
            marginTop: 50,
            fontSize: 16,
            color: "#D4AF37",
            letterSpacing: "5px",
            textTransform: "uppercase",
            fontWeight: 700,
          }),

          textNode(domain, {
            marginTop: 18,
            fontSize: domain.length > 18 ? 38 : 46,
            lineHeight: 1.08,
            fontWeight: 800,
            color: "#FFFFFF",
            wordBreak: "break-word",
          }),

          textNode(
            "Speed, SEO structure and AI visibility in one clean report.",
            {
              marginTop: 20,
              fontSize: 24,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.62)",
            }
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: "auto",
                paddingTop: 22,
                borderTop: "1px solid rgba(255,255,255,0.12)",
              },
            },

            textNode("Generated with", {
              fontSize: 18,
              color: "rgba(255,255,255,0.48)",
            }),

            textNode("sphawn.nl/siteaudit", {
              fontSize: 20,
              color: "#D4AF37",
              fontWeight: 700,
            })
          )
        ),

        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              maxWidth: 700,
              borderRadius: 36,
              padding: 24,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))",
              border: "1px solid rgba(255,255,255,0.13)",
            },
          },

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
            },

            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                },
              },

              textNode("Overall score", {
                fontSize: 18,
                color: "rgba(255,255,255,0.55)",
              }),

              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 10,
                    marginTop: 8,
                  },
                },

                textNode(String(overall), {
                  fontSize: 82,
                  lineHeight: 1,
                  fontWeight: 900,
                }),

                textNode("/100", {
                  marginBottom: 10,
                  fontSize: 24,
                  color: "rgba(255,255,255,0.45)",
                })
              )
            ),

            textNode(getLabel(overall), {
              padding: "12px 18px",
              borderRadius: 999,
              background: `${overallAccent}22`,
              color: overallAccent,
              fontSize: 18,
              fontWeight: 700,
            })
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                gap: 12,
                marginTop: 22,
              },
            },

            scoreCard("Speed", speed),
            scoreCard("SEO", seo),
            scoreCard("AI Visibility", ai)
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                gap: 12,
                marginTop: 12,
              },
            },

            scoreCard("Accessibility", accessibility),
            scoreCard("Best Practices", bestPractices)
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                gap: 10,
                marginTop: 18,
              },
            },

            metricCard("FCP", fcp),
            metricCard("LCP", lcp),
            metricCard("CLS", cls),
            metricCard("TBT", tbt),
            metricCard("Speed Index", speedIndex)
          )
        )
      )
    ),

    {
      width: 1200,
      height: 630,
    }
  );
}