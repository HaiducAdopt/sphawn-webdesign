import { SecurityAuditCheck } from "../types";

function buildHttpUrl(hostname: string): string {
  return `http://${hostname}`;
}

function buildHttpsUrl(hostname: string): string {
  return `https://${hostname}`;
}

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

export async function checkSslAndHttps(
  hostname: string
): Promise<SecurityAuditCheck[]> {
  const checks: SecurityAuditCheck[] = [];

  const httpsUrl = buildHttpsUrl(hostname);
  const httpUrl = buildHttpUrl(hostname);

  try {
    const httpsResponse = await safeFetch(httpsUrl);

    checks.push({
      id: "https-available",
      title: "HTTPS Available",
      description: "The website is reachable over HTTPS.",
      category: "https",
      status: "pass",
      risk: "info",
      scoreImpact: 0,
      recommendation: "Keep HTTPS enabled and renew SSL certificates on time.",
      evidence: httpsResponse.url,
    });
  } catch {
    checks.push({
      id: "https-available",
      title: "HTTPS Available",
      description: "The website is not reachable over HTTPS.",
      category: "https",
      status: "fail",
      risk: "high",
      scoreImpact: -25,
      recommendation:
        "Enable HTTPS with a valid SSL certificate before collecting user data or payments.",
    });

    return checks;
  }

  try {
    const httpResponse = await safeFetch(httpUrl);
    const finalUrl = httpResponse.url;
    const redirectsToHttps = finalUrl.startsWith("https://");

    checks.push({
      id: "http-to-https-redirect",
      title: "HTTP to HTTPS Redirect",
      description: redirectsToHttps
        ? "HTTP traffic redirects to HTTPS."
        : "HTTP traffic does not redirect to HTTPS.",
      category: "https",
      status: redirectsToHttps ? "pass" : "warning",
      risk: redirectsToHttps ? "info" : "medium",
      scoreImpact: redirectsToHttps ? 0 : -10,
      recommendation:
        "Redirect all HTTP traffic to HTTPS to prevent insecure access.",
      evidence: finalUrl,
    });
  } catch {
    checks.push({
      id: "http-to-https-redirect",
      title: "HTTP to HTTPS Redirect",
      description: "Unable to verify whether HTTP redirects to HTTPS.",
      category: "https",
      status: "warning",
      risk: "low",
      scoreImpact: -3,
      recommendation:
        "Check the web server or hosting settings and make sure HTTP redirects to HTTPS.",
    });
  }

  return checks;
}