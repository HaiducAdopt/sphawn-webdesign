// app/cookie-statement/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cookieStatement.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CookieStatementPage() {
  const t = await getTranslations("cookieStatement.page");

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
          <p className="mt-3 text-slate-300 max-w-2xl">
            {t("intro")}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          {t.raw("sections").map(
            (section: {
              title: string;
              paragraphs: string[];
              list?: string[];
            }) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {section.title}
                </h2>

                {section.paragraphs.map((p) => (
                  <p key={p} className="mt-2">
                    {p}
                  </p>
                ))}

                {section.list && (
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            )
          )}

          <p className="mt-10 text-sm text-slate-400">
            {t("lastUpdated")}
          </p>
        </div>
      </section>
    </main>
  );
}
