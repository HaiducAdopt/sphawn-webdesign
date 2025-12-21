"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Concept = {
  id: string;
  image: string;
};

const concepts: Concept[] = [
  { id: "restaurant", image: "/portfolio/concepts/restaurant.png" },
  { id: "dentist", image: "/portfolio/concepts/dentist.png" },
  { id: "gym", image: "/portfolio/concepts/gym.png" },
  { id: "logistics", image: "/portfolio/concepts/logistics.png" },
  { id: "dog-services", image: "/portfolio/concepts/dog-services.png" },
  { id: "saas", image: "/portfolio/concepts/saas.png" },
];

export default function HomeConceptsSection() {
  const t = useTranslations("portfolio.concepts");
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const closeModal = () => setSelectedConcept(null);

  const selected = selectedConcept
    ? concepts.find((c) => c.id === selectedConcept)
    : null;

  return (
    <section className="mt-10 space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-1 max-w-2xl text-[15px] sm:text-sm leading-relaxed text-slate-300/90">
            {t("subtitle")}
          </p>
        </div>

        <p className="text-[13px] sm:text-xs text-slate-400">
          {t("note")}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.8)] ring-1 ring-slate-900/70 cursor-pointer"
            onClick={() => setSelectedConcept(concept.id)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={concept.image}
                alt={t(`items.${concept.id}.title`)}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-90" />

              <div className="absolute inset-x-0 bottom-0 space-y-1 px-4 pb-4">
                <p className="text-[13px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  {t("tag")}
                </p>

                <h3 className="text-[16px] sm:text-base font-semibold text-slate-50 break-words">
                  {t(`items.${concept.id}.title`)}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-[13px] sm:text-[11px] text-slate-300">
              <span>{t("footerLeft")}</span>
              <span className="text-slate-500 whitespace-nowrap">
                {t("footerRight")}
              </span>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-cyan-400/70 group-hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition" />
          </motion.div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 pt-24 sm:pt-20 cursor-pointer"
          onClick={closeModal}
          onTouchStart={(e) => setTouchStartY(e.touches[0].clientY)}
          onTouchEnd={(e) => {
            if (touchStartY === null) return;
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(deltaY) > 60) closeModal();
            setTouchStartY(null);
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative max-w-5xl w-[95vw] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950/80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-slate-100 text-sm font-semibold hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
            >
              ×
            </button>

            <div className="relative w-full">
              <Image
                src={selected.image}
                alt={t(`items.${selected.id}.title`)}
                width={1600}
                height={900}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-[13px] sm:text-xs text-slate-300/90">
              <span>{t(`items.${selected.id}.title`)}</span>
              <span className="text-slate-400">{t("modalHint")}</span>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
