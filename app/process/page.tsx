import type { Metadata } from "next";
import ProcessDashboardSection from "../components/ProcessDashboardSection";

export const metadata: Metadata = {
  title: "Proces | Webdesign aanpak",
  description:
    "Transparante en efficiënte aanpak voor het ontwerpen en bouwen van jouw website. Van concept tot lancering, stap voor stap.",
};

export default function ProcessPage() {
  return (
    <main>
      <ProcessDashboardSection />
    </main>
  );
}
