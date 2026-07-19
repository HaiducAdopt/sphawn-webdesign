import { useTranslations } from "next-intl";

type Benefit = {
  code: string;
  title: string;
  description: string;
};

export default function NextBenefits() {
  const t = useTranslations("NextJsPage.benefits");
  const benefits = t.raw("items") as Benefit[];

  return (
    <section className="bg-[#07111f] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
            {t("label")}
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            {t("description")}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 min-w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-purple-400/15 px-3 text-xs font-bold tracking-wider text-cyan-200">
                {benefit.code}
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {benefit.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}