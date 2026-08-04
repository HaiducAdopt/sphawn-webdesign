import { useTranslations } from "next-intl";

type WebsiteType = { code: string; title: string; description: string };

export default function WordPressIntroduction() {
  const t = useTranslations("WordPressPage.introduction");
  const websiteTypes = t.raw("websiteTypes") as WebsiteType[];

  return (
    <section className="bg-[#0a1a2f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{t("label")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("title")}</h2>
          <div className="mt-8 space-y-6 text-lg leading-8 text-slate-300">
            <p>{t("paragraphOne")}</p>
            <p>{t("paragraphTwo")}</p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {websiteTypes.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <div className="mb-5 flex h-12 min-w-12 w-fit items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/10 to-indigo-300/10 px-3 text-xs font-bold tracking-wider text-sky-200">{item.code}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}