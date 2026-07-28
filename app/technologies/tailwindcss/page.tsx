import TailwindHero from "../../components/technologies/tailwind/TailwindHero";
import TailwindIntroduction from "../../components/technologies/tailwind/TailwindIntroduction";
import TailwindBenefits from "../../components/technologies/tailwind/TailwindBenefits";
import TailwindProjects from "../../components/technologies/tailwind/TailwindProjects";
import TailwindSeoAi from "../../components/technologies/tailwind/TailwindSeoAi";
import TailwindRelatedArticles from "../../components/technologies/tailwind/TailwindRelatedArticles";
import TailwindFinalCta from "../../components/technologies/tailwind/TailwindFinalCta";

export default function TailwindCssPage() {
  return (
    <main className="min-h-screen bg-[#07111f]">
      <TailwindHero />
      <TailwindIntroduction />
      <TailwindBenefits />
      <TailwindProjects />
      <TailwindSeoAi />
      <TailwindRelatedArticles />
      <TailwindFinalCta />
    </main>
  );
}
