import { NextRequest, NextResponse } from "next/server";

import { generateSecurityPdf } from "@/lib/security-audit/pdf";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    if (
      !body?.domain ||
      !body?.checks ||
      !body?.summary
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Invalid PDF report data.",
        },

        {
          status: 400,
        }
      );
    }

    const doc =
      generateSecurityPdf(
        {
          domain:
            body.domain,

          score:
            body.summary
              .score,

          passed:
            body.summary
              .passed,

          warnings:
            body.summary
              .warnings,

          failed:
            body.summary
              .failed,

          checks:
            body.checks,

          locale:
            body.locale ??
            "en",
        }
      );

    const pdfArrayBuffer =
      doc.output(
        "arraybuffer"
      );

    return new NextResponse(
      pdfArrayBuffer,

      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="sphawn-security-audit-${body.domain}.pdf"`,
        },
      }
    );
  } catch (
    error
  ) {
    console.error(
      "[SECURITY_AUDIT_PDF_ERROR]",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to generate PDF report.",
      },

      {
        status: 500,
      }
    );
  }
}