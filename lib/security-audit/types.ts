export type SecurityRiskLevel = "info" | "low" | "medium" | "high";

export type SecurityCheckStatus = "pass" | "warning" | "fail" | "info";

export type SecurityCheckCategory =
  | "https"
  | "headers"
  | "cookies"
  | "wordpress"
  | "dns"
  | "general";

export type SecurityAuditCheck = {
  id: string;
  title: string;
  description: string;
  category: SecurityCheckCategory;
  status: SecurityCheckStatus;
  risk: SecurityRiskLevel;
  scoreImpact: number;
  recommendation: string;
  evidence?: string;
};

export type SecurityAuditSummary = {
  score: number;
  passed: number;
  warnings: number;
  failed: number;
  info: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
};

export type SecurityAuditResult = {
  url: string;
  normalizedUrl: string;
  hostname: string;
  scannedAt: string;
  summary: SecurityAuditSummary;
  checks: SecurityAuditCheck[];
};

export type RunSecurityAuditInput = {
  url: string;
};