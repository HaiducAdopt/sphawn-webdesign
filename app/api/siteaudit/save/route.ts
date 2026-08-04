import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 750_000;
const ALLOWED_LOCALES = new Set(["en", "nl"]);

type JsonObject = Record<string, unknown>;

type SaveAuditBody = {
  auditId?: string;
  locale: string;
  website: {
    url: string;
    speedResults: JsonObject;
    aiResult: JsonObject;
    aiExplainResults: JsonObject;
  };
  competitor?: {
    url: string;
    speedResults: JsonObject;
    aiResult: JsonObject;
    aiExplainResults: JsonObject;
  } | null;
  comparisonExplanationResults?: JsonObject | null;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2_048) return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidBody(value: unknown): value is SaveAuditBody {
  if (!isObject(value)) return false;

  const website = value.website;
  const competitor = value.competitor;

  if (
    value.auditId !== undefined &&
    (typeof value.auditId !== "string" ||
      !/^[A-Za-z0-9_-]{10,128}$/.test(value.auditId))
  ) {
    return false;
  }

  if (
    typeof value.locale !== "string" ||
    !ALLOWED_LOCALES.has(value.locale) ||
    !isObject(website) ||
    !isHttpUrl(website.url) ||
    !isObject(website.speedResults) ||
    !isObject(website.aiResult) ||
    !isObject(website.aiExplainResults)
  ) {
    return false;
  }

  if (competitor !== undefined && competitor !== null) {
    if (
      !isObject(competitor) ||
      !isHttpUrl(competitor.url) ||
      !isObject(competitor.speedResults) ||
      !isObject(competitor.aiResult) ||
      !isObject(competitor.aiExplainResults)
    ) {
      return false;
    }
  }

  return (
    value.comparisonExplanationResults === undefined ||
    value.comparisonExplanationResults === null ||
    isObject(value.comparisonExplanationResults)
  );
}

function hasAtLeastOneResult(results: JsonObject) {
  return isObject(results.mobile) || isObject(results.desktop);
}

function normalizeForFirestore<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 },
      );
    }

    const rawBody = await request.text();

    if (!rawBody || Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "The audit report is empty or too large." },
        { status: 413 },
      );
    }

    let parsedBody: unknown;

    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    if (!isValidBody(parsedBody)) {
      return NextResponse.json(
        { error: "Invalid audit report data." },
        { status: 400 },
      );
    }

    if (!hasAtLeastOneResult(parsedBody.website.speedResults)) {
      return NextResponse.json(
        { error: "At least one website audit result is required." },
        { status: 400 },
      );
    }

    if (
      parsedBody.competitor &&
      !hasAtLeastOneResult(parsedBody.competitor.speedResults)
    ) {
      return NextResponse.json(
        { error: "The competitor audit does not contain a result." },
        { status: 400 },
      );
    }

    const report = normalizeForFirestore(parsedBody);
    const { auditId: requestedAuditId, ...reportData } = report;
    const documentRef = requestedAuditId
      ? adminDb.collection("siteAudits").doc(requestedAuditId)
      : adminDb.collection("siteAudits").doc();

    if (requestedAuditId) {
      const existingDocument = await documentRef.get();
      if (!existingDocument.exists) {
        return NextResponse.json(
          { error: "The audit report was not found." },
          { status: 404 },
        );
      }
    }

    await documentRef.set(
      {
        ...reportData,
        version: 1,
        status: "complete",
        public: true,
        ...(requestedAuditId
          ? {}
          : { createdAt: FieldValue.serverTimestamp() }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: Boolean(requestedAuditId) },
    );

    return NextResponse.json(
      {
        success: true,
        auditId: documentRef.id,
        reportPath: `/${reportData.locale}/siteaudit/report/${documentRef.id}`,
      },
      { status: requestedAuditId ? 200 : 201 },
    );
  } catch (error) {
    console.error("Failed to save SiteAudit report:", error);

    return NextResponse.json(
      { error: "The audit report could not be saved." },
      { status: 500 },
    );
  }
}