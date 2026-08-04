import WordPressHero from "../../components/technologies/wordpress/WordPressHero";
import WordPressIntroduction from "../../components/technologies/wordpress/WordPressIntroduction";
import WordPressBenefits from "../../components/technologies/wordpress/WordPressBenefits";
import WordPressProjects from "../../components/technologies/wordpress/WordPressProjects";
import WordPressSeoAi from "../../components/technologies/wordpress/WordPressSeoAi";
import WordPressRelatedArticles from "../../components/technologies/wordpress/WordPressRelatedArticles";
import WordPressFinalCta from "../../components/technologies/wordpress/WordPressFinalCta";

export default function WordPressPage() {
  return (
    <main className="min-h-screen bg-[#07111f]">
      <WordPressHero />
      <WordPressIntroduction />
      <WordPressBenefits />
      <WordPressProjects />
      <WordPressSeoAi />
      <WordPressRelatedArticles />
      <WordPressFinalCta />
    </main>
  );
}