"use client";

import nextDynamic from "next/dynamic";

const ProcessDashboardSection = nextDynamic(
  () => import("../../components/ProcessDashboardSection"),
  { ssr: false }
);

export default function ProcessClient() {
  return (
    <main>
      <ProcessDashboardSection />
    </main>
  );
}
