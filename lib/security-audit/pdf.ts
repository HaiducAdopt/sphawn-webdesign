import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  PdfLocale,
  pdfTranslations,
} from "./pdfTranslations";

type SecurityCheck = {
  title: string;
  category?: string;
  status?: string;
  risk: string;
  description: string;
  recommendation: string;
};

type PdfInput = {
  domain: string;
  score: number;
  passed: number;
  warnings: number;
  failed: number;
  checks: SecurityCheck[];
  locale?: PdfLocale;
};

function scoreLabel(score: number) {
  if (score >= 85) return "GOOD";
  if (score >= 65) return "MODERATE";
  if (score >= 40) return "NEEDS IMPROVEMENT";
  return "HIGH RISK";
}

export function generateSecurityPdf(input: PdfInput) {
  const locale = input.locale ?? "en";
  const t = pdfTranslations[locale];

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // PAGE 1 — COVER + SUMMARY
  doc.setFillColor("#070b16");
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor("#ccaa3e");
  doc.setFontSize(18);
  doc.text("SPHAWN", 14, 22);

  doc.setTextColor("#ffffff");
  doc.setFontSize(28);
  doc.text(t.reportTitle, 14, 48, {
    maxWidth: 180,
  });

  doc.setTextColor("#9ca3af");
  doc.setFontSize(10);
  doc.text(t.subtitle, 14, 68);

  doc.setTextColor("#9ca3af");
  doc.setFontSize(8);
  doc.text(t.websiteAnalyzed, 14, 92);

  doc.setTextColor("#ffffff");
  doc.setFontSize(15);
  doc.text(input.domain, 14, 103);

  doc.setTextColor("#9ca3af");
  doc.setFontSize(8);
  doc.text(t.generatedOn, 14, 122);

  doc.setTextColor("#ffffff");
  doc.setFontSize(10);
  doc.text(new Date().toLocaleString(locale), 14, 132);

  doc.setFillColor("#ccaa3e");
  doc.circle(38, 176, 24, "F");

  doc.setFillColor("#070b16");
  doc.circle(38, 176, 18, "F");

  doc.setTextColor("#ffffff");
  doc.setFontSize(27);
  doc.text(String(input.score), 28, 178);

  doc.setTextColor("#9ca3af");
  doc.setFontSize(10);
  doc.text("/100", 46, 178);

  doc.setTextColor("#ccaa3e");
  doc.setFontSize(10);
  doc.text(t.riskLevel, 82, 164);

  doc.setTextColor("#ffffff");
  doc.setFontSize(18);
  doc.text(scoreLabel(input.score), 82, 178);

  doc.setFillColor("#111827");
  doc.roundedRect(14, 218, 55, 38, 4, 4, "F");
  doc.roundedRect(77, 218, 55, 38, 4, 4, "F");
  doc.roundedRect(140, 218, 55, 38, 4, 4, "F");

  doc.setTextColor("#34d399");
  doc.setFontSize(24);
  doc.text(String(input.passed), 31, 237);
  doc.setFontSize(8);
  doc.text(t.passed, 25, 248);

  doc.setTextColor("#fbbf24");
  doc.setFontSize(24);
  doc.text(String(input.warnings), 94, 237);
  doc.setFontSize(8);
  doc.text(t.warnings, 84, 248);

  doc.setTextColor("#f87171");
  doc.setFontSize(24);
  doc.text(String(input.failed), 158, 237);
  doc.setFontSize(8);
  doc.text(t.failed, 153, 248);

  doc.setFillColor("#111827");
  doc.roundedRect(14, 266, 182, 18, 4, 4, "F");

  doc.setTextColor("#f4d77b");
  doc.setFontSize(8);
  doc.text(t.coverNote, 22, 273);

  doc.setTextColor("#9ca3af");
  doc.setFontSize(7);
  doc.text(t.coverDisclaimer, 22, 279);

  // PAGE 2 — SUMMARY + FINDINGS
  doc.addPage();
  doc.setFillColor("#070b16");
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor("#ffffff");
  doc.setFontSize(20);
  doc.text(t.executiveSummary, 14, 26);

  doc.setTextColor("#9ca3af");
  doc.setFontSize(8);
  doc.text(doc.splitTextToSize(t.summaryText1, 180), 14, 42);
  doc.text(doc.splitTextToSize(t.summaryText2, 180), 14, 56);
  doc.text(doc.splitTextToSize(t.summaryText3, 180), 14, 70);

  doc.setTextColor("#60a5fa");
  doc.setFontSize(10);
  doc.text(t.aboutAudit, 14, 94);

  doc.setTextColor("#9ca3af");
  doc.setFontSize(8);
  doc.text(t.aboutAuditText1, 14, 106);
  doc.text(t.aboutAuditText2, 14, 114);

  doc.setTextColor("#ffffff");
  doc.setFontSize(20);
  doc.text(t.findingsOverview, 14, 140);

  autoTable(doc, {
    startY: 152,
    head: [[t.finding, t.risk, t.status]],
    body: input.checks.map((check) => [
      check.title,
      check.risk,
      check.status ?? "info",
    ]),
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 2.2,
      textColor: "#ffffff",
      fillColor: "#111827",
      lineColor: "#263244",
      lineWidth: 0.2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: "#ccaa3e",
      textColor: "#070b16",
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: "#0f172a",
    },
    columnStyles: {
      0: { cellWidth: 105 },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
    },
    margin: {
      left: 14,
      right: 14,
    },
  });

  // PAGE 3 — RECOMMENDATIONS + NEXT STEPS
  doc.addPage();
  doc.setFillColor("#070b16");
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor("#ffffff");
  doc.setFontSize(20);
  doc.text(t.recommendation, 14, 26);

  const importantChecks = input.checks.filter(
    (check) => check.risk !== "info"
  );

  autoTable(doc, {
    startY: 38,
    head: [[t.finding, t.risk, t.recommendation]],
    body: importantChecks.map((check) => [
      check.title,
      check.risk,
      check.recommendation,
    ]),
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 2.2,
      textColor: "#ffffff",
      fillColor: "#111827",
      lineColor: "#263244",
      lineWidth: 0.2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: "#ccaa3e",
      textColor: "#070b16",
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: "#0f172a",
    },
    columnStyles: {
      0: { cellWidth: 48 },
      1: { cellWidth: 25 },
      2: { cellWidth: 102 },
    },
    margin: {
      left: 14,
      right: 14,
    },
  });

  const finalY =
    (doc as unknown as { lastAutoTable?: { finalY?: number } })
      .lastAutoTable?.finalY ?? 150;

  const nextStepsStart = Math.min(finalY + 18, 210);

  doc.setTextColor("#ffffff");
  doc.setFontSize(18);
  doc.text(t.nextSteps, 14, nextStepsStart);

  doc.setTextColor("#ccaa3e");
  doc.setFontSize(12);
  doc.text(t.needHelp, 14, nextStepsStart + 16);

  doc.setTextColor("#9ca3af");
  doc.setFontSize(8);
  doc.text(t.nextStepsText1, 14, nextStepsStart + 28);
  doc.text(t.nextStepsText2, 14, nextStepsStart + 36);

  doc.setFontSize(8);

  t.bullets.slice(0, 5).forEach((bullet, index) => {
    const y = nextStepsStart + 52 + index * 8;

    doc.setTextColor("#ccaa3e");
    doc.text("✓", 18, y);

    doc.setTextColor("#ffffff");
    doc.text(bullet, 26, y, {
      maxWidth: 150,
    });
  });

  doc.setFillColor("#ccaa3e");
  doc.roundedRect(14, 265, 95, 18, 4, 4, "F");

  doc.setTextColor("#070b16");
  doc.setFontSize(13);
  doc.text(t.contact, 27, 277);

  return doc;
}