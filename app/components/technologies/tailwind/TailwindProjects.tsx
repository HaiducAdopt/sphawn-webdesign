import { useTranslations } from "next-intl";

type Project = { name: string; type: string; description: string; href: string };

export default function TailwindProjects() {
  const t = useTranslations("TailwindPage.projects");
  const projects = t.raw("items") as Project[];

  return (
    <section className="bg-[#0a1a2f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">{t("label")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{t("description")}</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article key={project.name} className="flex min-h-[360px] flex-col rounded-3xl border border-white/10 bg-[#07111f] p-8">
              <div className="text-sm font-semibold text-cyan-300">{String(index + 1).padStart(2, "0")}</div>
              <h3 className="mt-8 text-2xl font-bold">{project.name}</h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-purple-300">{project.type}</p>
              <p className="mt-6 flex-1 leading-7 text-slate-300">{project.description}</p>
              <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-300 transition hover:text-cyan-200" aria-label={`${t("visit")} ${project.name}`}>
                {t("visit")} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
