// app/privacy-policy/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacyPolicy.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacyPolicy.page");

  const business = t.raw("business") as {
    name: string;
    kvk: string;
    location: string;
    email: string;
  };

  const sections = t.raw("sections") as Array<{
    title: string;
    paragraphs: string[];
    list?: string[];
    businessList?: boolean;
    includeEmailLink?: boolean;
  }>;

  return (
    <main className="relative min-h-screen bg-[#0A1A2F] text-white overflow-hidden">
      {/* BG blur circles */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E1F0] opacity-30 blur-[160px]" />
      <div className="absolute top-[-250px] left-[-150px] w-[750px] h-[750px] rounded-full bg-[#BC4EF0] opacity-30 blur-[180px]" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-24">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">{t("intro")}</p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white mb-2">
                {section.title}
              </h2>

              {section.paragraphs.map((p) => (
                <p key={p} className="mt-2">
                  {p}
                </p>
              ))}

              {section.businessList && (
                <ul className="mt-2 text-sm space-y-1">
                  <li>
                    {t("labels.businessName")}{" "}
                    <strong className="text-slate-200">{business.name}</strong>
                  </li>
                  <li>
                    {t("labels.kvk")}{" "}
                    <strong className="text-slate-200">{business.kvk}</strong>
                  </li>
                  <li>
                    {t("labels.location")}{" "}
                    <strong className="text-slate-200">
                      {business.location}
                    </strong>
                  </li>
                  <li>
                    {t("labels.email")}{" "}
                    <a
                      href={`mailto:${business.email}`}
                      className="text-cyan-300 hover:text-cyan-200 underline"
                    >
                      {business.email}
                    </a>
                  </li>
                </ul>
              )}

              {section.list && (
                <ul className="mt-2 list-disc list-inside text-sm">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.includeEmailLink && (
                <p className="mt-2">
                  {t("emailLine.before")}{" "}
                  <a
                    href={`mailto:${business.email}`}
                    className="text-cyan-300 hover:text-cyan-200 underline"
                  >
                    {business.email}
                  </a>
                  {t("emailLine.after")}
                </p>
              )}
            </section>
          ))}

          <p className="mt-6 text-sm text-slate-400">{t("lastUpdated")}</p>
        </div>
      </section>
    </main>
  );
}
