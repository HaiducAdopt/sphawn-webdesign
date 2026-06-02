import { promises as dns } from "dns";
import { SecurityAuditCheck } from "../types";

function getRootHostname(hostname: string): string {
  return hostname.replace(/^www\./i, "");
}

function extractTxtValues(records: string[][]): string[] {
  return records.map((record) => record.join(""));
}

function hasSpfRecord(txtValues: string[]): boolean {
  return txtValues.some((value) =>
    value.toLowerCase().startsWith("v=spf1")
  );
}

function hasDmarcRecord(txtValues: string[]): boolean {
  return txtValues.some((value) =>
    value.toLowerCase().startsWith("v=dmarc1")
  );
}

export async function checkDnsSecurity(
  hostname: string
): Promise<SecurityAuditCheck[]> {
  const checks: SecurityAuditCheck[] = [];
  const rootHostname = getRootHostname(hostname);

  try {
    const txtRecords = await dns.resolveTxt(rootHostname);
    const txtValues = extractTxtValues(txtRecords);
    const spfExists = hasSpfRecord(txtValues);
    const spfEvidence = txtValues.find((value) =>
      value.toLowerCase().startsWith("v=spf1")
    );

    checks.push({
      id: "dns-spf",
      title: "SPF Record",
      description: spfExists
        ? "An SPF record was found for this domain."
        : "No SPF record was found for this domain.",
      category: "dns",
      status: spfExists ? "pass" : "warning",
      risk: spfExists ? "info" : "medium",
      scoreImpact: spfExists ? 0 : -6,
      recommendation:
        "Add an SPF record to define which mail servers are allowed to send email for this domain.",
      evidence: spfEvidence,
    });
  } catch {
    checks.push({
      id: "dns-spf",
      title: "SPF Record",
      description: "Unable to verify SPF records for this domain.",
      category: "dns",
      status: "warning",
      risk: "low",
      scoreImpact: -2,
      recommendation:
        "Check the domain DNS settings and add an SPF record if the domain sends email.",
    });
  }

  try {
    const dmarcRecords = await dns.resolveTxt(`_dmarc.${rootHostname}`);
    const dmarcValues = extractTxtValues(dmarcRecords);
    const dmarcExists = hasDmarcRecord(dmarcValues);
    const dmarcEvidence = dmarcValues.find((value) =>
      value.toLowerCase().startsWith("v=dmarc1")
    );

    checks.push({
      id: "dns-dmarc",
      title: "DMARC Record",
      description: dmarcExists
        ? "A DMARC record was found for this domain."
        : "No DMARC record was found for this domain.",
      category: "dns",
      status: dmarcExists ? "pass" : "warning",
      risk: dmarcExists ? "info" : "medium",
      scoreImpact: dmarcExists ? 0 : -6,
      recommendation:
        "Add a DMARC record to protect the domain against email spoofing and improve email trust.",
      evidence: dmarcEvidence,
    });
  } catch {
    checks.push({
      id: "dns-dmarc",
      title: "DMARC Record",
      description: "No DMARC record was found or the DNS lookup failed.",
      category: "dns",
      status: "warning",
      risk: "medium",
      scoreImpact: -6,
      recommendation:
        "Add a DMARC record such as v=DMARC1; p=none; rua=mailto:you@example.com and later move to a stricter policy.",
    });
  }

  return checks;
}