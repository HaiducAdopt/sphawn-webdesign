import { checkDnsSecurity } from "./checks/dns";
import { checkSecurityHeaders } from "./checks/headers";
import { checkSslAndHttps } from "./checks/ssl";
import { checkWordPress } from "./checks/wordpress";
import { calculateSecurityScore } from "./score";
import {
  RunSecurityAuditInput,
  SecurityAuditResult,
} from "./types";

function normalizeUrl(inputUrl: string): URL {
  const trimmedUrl = inputUrl.trim();

  const urlWithProtocol =
    trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")
      ? trimmedUrl
      : `https://${trimmedUrl}`;

  return new URL(urlWithProtocol);
}

export async function runSecurityAudit(
  input: RunSecurityAuditInput
): Promise<SecurityAuditResult> {
  const parsedUrl = normalizeUrl(input.url);

  const hostname = parsedUrl.hostname;
  const normalizedUrl = `https://${hostname}`;

  const [sslChecks, headerChecks, wordpressChecks, dnsChecks] =
    await Promise.all([
      checkSslAndHttps(hostname),
      checkSecurityHeaders(normalizedUrl),
      checkWordPress(normalizedUrl),
      checkDnsSecurity(hostname),
    ]);

  const checks = [
    ...sslChecks,
    ...headerChecks,
    ...wordpressChecks,
    ...dnsChecks,
  ];

  const summary = calculateSecurityScore(checks);

  return {
    url: input.url,
    normalizedUrl,
    hostname,
    scannedAt: new Date().toISOString(),
    summary,
    checks,
  };
}