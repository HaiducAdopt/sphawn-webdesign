import {
  SecurityAuditCheck,
  SecurityAuditSummary,
} from "./types";

function countByStatus(
  checks: SecurityAuditCheck[],
  status: SecurityAuditCheck["status"]
): number {
  return checks.filter((check) => check.status === status).length;
}

function countByRisk(
  checks: SecurityAuditCheck[],
  risk: SecurityAuditCheck["risk"]
): number {
  return checks.filter((check) => check.risk === risk).length;
}

export function calculateSecurityScore(
  checks: SecurityAuditCheck[]
): SecurityAuditSummary {
  const rawScore = checks.reduce((total, check) => {
    return total + check.scoreImpact;
  }, 100);

  const score = Math.max(0, Math.min(100, rawScore));

  return {
    score,
    passed: countByStatus(checks, "pass"),
    warnings: countByStatus(checks, "warning"),
    failed: countByStatus(checks, "fail"),
    info: countByStatus(checks, "info"),
    highRisk: countByRisk(checks, "high"),
    mediumRisk: countByRisk(checks, "medium"),
    lowRisk: countByRisk(checks, "low"),
  };
}