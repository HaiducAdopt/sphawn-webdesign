import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Project = { name: string; type: string; description: string; decision: string };

export default function WordPressProjects() {
  const t = useTranslations("WordPressPage.projects");
  const locale = useLocale();
  const projects = t.raw("items") as Project[];

  return (
    <section className="bg-[#0a1a2f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{t("label")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{t("description")}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article key={project.name} className="flex min-h-[390px] flex-col rounded-3xl border border-white/10 bg-[#07111f] p-8">
              <div className="text-sm font-semibold text-sky-200">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="mt-8 text-2xl font-bold">{project.name}</h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-indigo-200">{project.type}</p>
              <p className="mt-6 leading-7 text-slate-300">{project.description}</p>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm font-semibold text-sky-200">{t("decisionLabel")}</p>
                <p className="mt-2 leading-7 text-slate-300">{project.decision}</p>
              </div>
            </article>
          ))}
        </div>

        <Link href={`/${locale}/portfolio`} className="mt-10 inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[0.05] px-6 py-3 font-semibold text-white transition hover:bg-white/[0.1]">
          {t("portfolioButton")}
        </Link>
      </div>
    </section>
  );
}
