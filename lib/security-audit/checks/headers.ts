import { SecurityAuditCheck } from "../types";

async function safeFetch(url: string): Promise<Response> {
  try {
    return await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });
  }
}

export async function checkSecurityHeaders(
  url: string
): Promise<SecurityAuditCheck[]> {
  const checks: SecurityAuditCheck[] = [];

  try {
    const response = await safeFetch(url);
    const headers = response.headers;

    const securityHeaders = [
      {
        key: "strict-transport-security",
        title: "HSTS Header",
        recommendation:
          "Enable Strict-Transport-Security for HTTPS protection.",
      },
      {
        key: "content-security-policy",
        title: "Content Security Policy",
        recommendation:
          "Add a Content-Security-Policy header to reduce XSS risks.",
      },
      {
        key: "x-frame-options",
        title: "X-Frame-Options",
        recommendation:
          "Add X-Frame-Options to reduce clickjacking risks.",
      },
      {
        key: "x-content-type-options",
        title: "X-Content-Type-Options",
        recommendation:
          "Add X-Content-Type-Options: nosniff.",
      },
      {
        key: "referrer-policy",
        title: "Referrer Policy",
        recommendation:
          "Define a Referrer-Policy header.",
      },
    ];

    for (const header of securityHeaders) {
      const exists = headers.has(header.key);

      checks.push({
        id: header.key,
        title: header.title,
        description: exists
          ? `${header.title} detected`
          : `${header.title} missing`,
        category: "headers",
        status: exists ? "pass" : "warning",
        risk: exists ? "info" : "medium",
        scoreImpact: exists ? 0 : -5,
        recommendation: header.recommendation,
        evidence: headers.get(header.key) ?? undefined,
      });
    }

    return checks;
  } catch {
    return [
      {
        id: "headers-fetch-failed",
        title: "Header scan failed",
        description: "Unable to retrieve response headers.",
        category: "headers",
        status: "fail",
        risk: "high",
        scoreImpact: -10,
        recommendation: "Check if the website is reachable.",
      },
    ];
  }
}