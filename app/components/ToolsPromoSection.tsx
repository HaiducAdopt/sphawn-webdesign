import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ToolPromoCard from "./ToolPromoCard";

type ToolItem = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  image: string;
};

export default async function ToolsPromoSection() {
  const t = await getTranslations("toolsPromo");

  const items = t.raw("items") as ToolItem[];

  return (
    <article className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950/60 shadow-[0_0_35px_rgba(34,211,238,0.10)] backdrop-blur">
      <div className="p-5 sm:p-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-cyan-300">
          {t("label")}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-slate-50 sm:text-2xl">
          {t("title")}
        </h2>

        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-300/85 sm:text-base">
          {t("description")}
        </p>
      </div>

      <div className="relative h-56 w-full sm:h-72">
        <Image
          src={t("image")}
          alt={t("title")}
          fill
          priority={false}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
      </div>

      <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-3">
        {items.map((item) => (
          <ToolPromoCard
            key={item.href}
            title={item.title}
            description={item.description}
            buttonLabel={item.buttonLabel}
            href={item.href}
            image={item.image}
          />
        ))}
      </div>
    </article>
  );
}