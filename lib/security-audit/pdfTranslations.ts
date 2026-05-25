export type PdfLocale = "en" | "nl";

export const pdfTranslations = {
  en: {
    reportTitle: "WEBSITE SECURITY AUDIT REPORT",
    subtitle: "Professional Security Configuration Review",
    websiteAnalyzed: "WEBSITE ANALYZED",
    generatedOn: "GENERATED ON",
    riskLevel: "RISK LEVEL",
    coverNote: "This is a non-invasive security configuration audit.",
    coverDisclaimer: "It does not represent a full penetration test.",

    executiveSummary: "EXECUTIVE SUMMARY",
    summaryText1:
      "We analyzed the public-facing configuration of this website to identify common security signals and potential misconfigurations.",
    summaryText2:
      "This audit checks HTTPS, security headers, DNS records and common WordPress exposure.",
    summaryText3:
      "It does not include vulnerability exploitation, authentication testing or penetration testing.",

    passed: "PASSED",
    warnings: "WARNINGS",
    failed: "FAILED",

    aboutAudit: "ABOUT THIS AUDIT",
    aboutAuditText1:
      "This report helps you understand visible security configuration issues.",
    aboutAuditText2:
      "It is intended as a practical first step before deeper technical remediation.",

    findingsOverview: "FINDINGS OVERVIEW",
    finding: "Finding",
    risk: "Risk",
    status: "Status",

    findingDetail: "FINDING DETAIL",
    category: "Category",
    whatItMeans: "WHAT IT MEANS",
    recommendation: "RECOMMENDATION",

    nextSteps: "NEXT STEPS",
    needHelp: "NEED HELP FIXING THESE ISSUES?",
    nextStepsText1:
      "Sphawn can help you improve your website security",
    nextStepsText2:
      "and build more trust with visitors and clients.",

    bullets: [
      "Configure security headers",
      "Improve HTTPS and DNS protection",
      "Review WordPress / Next.js exposure",
      "Prepare a clear technical action plan",
      "Enhance security, SEO and trust",
    ],

    contact: "CONTACT SPHAWN",
    whyItMatters: "WHY IT MATTERS",
    protectVisitors: "Protect your visitors",
    protectVisitorsText: "Reduce risk and data leaks.",
    buildTrust: "Build trust",
    buildTrustText: "Stronger security builds confidence.",
    improveSeo: "Improve SEO signals",
    improveSeoText: "Good configuration supports quality.",
  },

  nl: {
    reportTitle: "WEBSITE SECURITY AUDIT RAPPORT",
    subtitle: "Professionele beveiligingsconfiguratie controle",
    websiteAnalyzed: "GEANALYSEERDE WEBSITE",
    generatedOn: "GEGENEREERD OP",
    riskLevel: "RISICONIVEAU",
    coverNote: "Dit is een niet-invasieve beveiligingsconfiguratie audit.",
    coverDisclaimer: "Dit is geen volledige penetratietest.",

    executiveSummary: "SAMENVATTING",
    summaryText1:
      "We hebben de publieke configuratie van deze website geanalyseerd om veelvoorkomende beveiligingssignalen en mogelijke configuratiefouten te vinden.",
    summaryText2:
      "Deze audit controleert HTTPS, security headers, DNS-records en veelvoorkomende WordPress-blootstelling.",
    summaryText3:
      "De audit bevat geen exploitatie, login-tests of penetratietests.",

    passed: "GESLAAGD",
    warnings: "WAARSCHUWINGEN",
    failed: "MISLUKT",

    aboutAudit: "OVER DEZE AUDIT",
    aboutAuditText1:
      "Dit rapport helpt je zichtbare beveiligingsconfiguratieproblemen te begrijpen.",
    aboutAuditText2:
      "Het is bedoeld als praktische eerste stap vóór diepere technische verbeteringen.",

    findingsOverview: "OVERZICHT VAN BEVINDINGEN",
    finding: "Bevinding",
    risk: "Risico",
    status: "Status",

    findingDetail: "DETAIL VAN BEVINDING",
    category: "Categorie",
    whatItMeans: "WAT HET BETEKENT",
    recommendation: "AANBEVELING",

    nextSteps: "VOLGENDE STAPPEN",
    needHelp: "HULP NODIG BIJ HET OPLOSSEN?",
    nextStepsText1:
      "Sphawn kan je helpen om de beveiliging van je website te verbeteren",
    nextStepsText2:
      "en meer vertrouwen op te bouwen bij bezoekers en klanten.",

    bullets: [
      "Security headers configureren",
      "HTTPS- en DNS-bescherming verbeteren",
      "WordPress / Next.js-blootstelling controleren",
      "Een duidelijk technisch actieplan opstellen",
      "Security, SEO en vertrouwen verbeteren",
    ],

    contact: "CONTACT SPHAWN",
    whyItMatters: "WAAROM HET BELANGRIJK IS",
    protectVisitors: "Bescherm je bezoekers",
    protectVisitorsText: "Verlaag risico’s en datalekken.",
    buildTrust: "Bouw vertrouwen op",
    buildTrustText: "Sterkere beveiliging geeft vertrouwen.",
    improveSeo: "Verbeter SEO-signalen",
    improveSeoText: "Goede configuratie ondersteunt kwaliteit.",
  },
} as const;