import { SecurityAuditCheck } from "../types";

function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function checkUrlExists(url: string): Promise<{
  exists: boolean;
  status: number | null;
  evidence?: string;
}> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    return {
      exists: response.status >= 200 && response.status < 400,
      status: response.status,
      evidence: `${url} returned status ${response.status}`,
    };
  } catch {
    return {
      exists: false,
      status: null,
    };
  }
}

export async function checkWordPress(baseUrl: string): Promise<SecurityAuditCheck[]> {
  const checks: SecurityAuditCheck[] = [];

  const wpLoginUrl = buildUrl(baseUrl, "/wp-login.php");
  const xmlRpcUrl = buildUrl(baseUrl, "/xmlrpc.php");
  const restApiUrl = buildUrl(baseUrl, "/wp-json/");

  const wpLogin = await checkUrlExists(wpLoginUrl);
  const xmlRpc = await checkUrlExists(xmlRpcUrl);
  const restApi = await checkUrlExists(restApiUrl);

  const isLikelyWordPress =
    wpLogin.exists || xmlRpc.exists || restApi.exists;

  checks.push({
    id: "wordpress-detected",
    title: "WordPress Detection",
    description: isLikelyWordPress
      ? "The website appears to be using WordPress."
      : "No clear public WordPress indicators were detected.",
    category: "wordpress",
    status: isLikelyWordPress ? "info" : "pass",
    risk: "info",
    scoreImpact: 0,
    recommendation: isLikelyWordPress
      ? "Keep WordPress core, themes and plugins updated and use strong login protection."
      : "No WordPress-specific action required based on this basic check.",
    evidence: [
      wpLogin.evidence,
      xmlRpc.evidence,
      restApi.evidence,
    ]
      .filter(Boolean)
      .join(" | "),
  });

  if (!isLikelyWordPress) {
    return checks;
  }

  checks.push({
    id: "wordpress-login-public",
    title: "Public WordPress Login",
    description: wpLogin.exists
      ? "The default WordPress login page is publicly reachable."
      : "The default WordPress login page was not detected.",
    category: "wordpress",
    status: wpLogin.exists ? "warning" : "pass",
    risk: wpLogin.exists ? "low" : "info",
    scoreImpact: wpLogin.exists ? -3 : 0,
    recommendation:
      "Use strong passwords, two-factor authentication, login rate limiting and consider changing or protecting the default login URL.",
    evidence: wpLogin.evidence,
  });

  checks.push({
    id: "wordpress-xmlrpc",
    title: "XML-RPC Endpoint",
    description: xmlRpc.exists
      ? "The WordPress XML-RPC endpoint appears to be publicly reachable."
      : "The WordPress XML-RPC endpoint was not detected.",
    category: "wordpress",
    status: xmlRpc.exists ? "warning" : "pass",
    risk: xmlRpc.exists ? "medium" : "info",
    scoreImpact: xmlRpc.exists ? -7 : 0,
    recommendation:
      "Disable XML-RPC if it is not needed, or restrict access to reduce brute-force and abuse risks.",
    evidence: xmlRpc.evidence,
  });

  checks.push({
    id: "wordpress-rest-api",
    title: "WordPress REST API",
    description: restApi.exists
      ? "The WordPress REST API is publicly reachable."
      : "The WordPress REST API was not detected.",
    category: "wordpress",
    status: restApi.exists ? "info" : "pass",
    risk: "info",
    scoreImpact: 0,
    recommendation:
      "Public REST API access is normal for many WordPress sites, but sensitive data should never be exposed through custom endpoints.",
    evidence: restApi.evidence,
  });

  return checks;
}