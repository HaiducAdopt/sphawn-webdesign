import NextHero from "../../components/technologies/NextHero";
import NextIntroduction from "../../components/technologies/NextIntroduction";
import NextBenefits from "../../components/technologies/NextBenefits";
import NextProjects from "../../components/technologies/NextProjects";
import NextSeoAi from "../../components/technologies/NextSeoAi";
import NextRelatedArticles from "../../components/technologies/NextRelatedArticles";
import NextFinalCta from "../../components/technologies//NextFinalCta";

export default function NextJsPage() {
  return (
    <main className="min-h-screen bg-[#07111f]">
      <NextHero />
      <NextIntroduction />
      <NextBenefits />
      <NextProjects />
      <NextSeoAi />
      <NextRelatedArticles />
      <NextFinalCta />
    </main>
  );
}