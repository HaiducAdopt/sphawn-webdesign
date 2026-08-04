import { useTranslations } from "next-intl";

type ComparisonItem = { title: string; description: string };

export default function WordPressBenefits() {
  const t = useTranslations("WordPressPage.benefits");
  const advantages = t.raw("advantages.items") as ComparisonItem[];
  const limitations = t.raw("limitations.items") as ComparisonItem[];

  return (
    <section className="bg-[#07111f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">{t("label")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("title")}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">{t("description")}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-sky-200/15 bg-sky-300/[0.035] p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">{t("advantages.label")}</p>
            <h3 className="mt-3 text-2xl font-bold">{t("advantages.title")}</h3>
            <div className="mt-8 space-y-6">
              {advantages.map((item) => (
                <article key={item.title} className="border-t border-white/10 pt-6 first:border-0 first:pt-0">
                  <h4 className="flex gap-3 text-lg font-semibold"><span aria-hidden="true" className="text-sky-200">+</span>{item.title}</h4>
                  <p className="mt-2 pl-7 leading-7 text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-indigo-200/15 bg-indigo-300/[0.035] p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">{t("limitations.label")}</p>
            <h3 className="mt-3 text-2xl font-bold">{t("limitations.title")}</h3>
            <div className="mt-8 space-y-6">
              {limitations.map((item) => (
                <article key={item.title} className="border-t border-white/10 pt-6 first:border-0 first:pt-0">
                  <h4 className="flex gap-3 text-lg font-semibold"><span aria-hidden="true" className="text-indigo-200">!</span>{item.title}</h4>
                  <p className="mt-2 pl-7 leading-7 text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-9">
          <h3 className="text-xl font-semibold">{t("conclusionTitle")}</h3>
          <p className="mt-4 max-w-5xl leading-7 text-slate-300">{t("conclusionText")}</p>
        </div>
      </div>
    </section>
  );
}
