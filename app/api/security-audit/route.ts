import { NextRequest, NextResponse } from "next/server";
import { runSecurityAudit } from "@/lib/security-audit/runSecurityAudit";

function normalizeInputUrl(input: string): string {
  let value = input.trim();

  value = value.replace(/\s+/g, "");

  value = value.replace(
    /(https?:\/\/.+?)(https?:\/\/.+)/i,
    "$1"
  );

  if (
    !value.startsWith("http://") &&
    !value.startsWith("https://")
  ) {
    value = `https://${value}`;
  }

  return value;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const rawUrl =
      body.url?.trim() ?? "";

    if (!rawUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Website URL is required.",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedUrl =
      normalizeInputUrl(rawUrl);

    if (
      !isValidUrl(normalizedUrl)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid website URL.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await runSecurityAudit({
        url: normalizedUrl,
      });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "[SECURITY_AUDIT_ERROR]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to run security audit.",
      },
      {
        status: 500,
      }
    );
  }
}