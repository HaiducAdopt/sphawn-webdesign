// app/components/PricingFlipCards.tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type PackageItem = {
  name: string;
  priceFrom: string;
  tag: string;
  short: string;
  backTitle: string;
  backItems: string[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampTextClass(lines: 2 | 3 | 4) {
  if (lines === 2) return "max-h-[2.8em] overflow-hidden";
  if (lines === 3) return "max-h-[4.2em] overflow-hidden";
  return "max-h-[5.6em] overflow-hidden";
}

export default function PricingFlipCards() {
  const t = useTranslations("offersPricing");

  const items = useMemo<PackageItem[]>(
    () => (t.raw("packages") as PackageItem[]),
    [t]
  );

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
            {t("section.label")}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white">
            {t("section.title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/60 max-w-2xl">
            {t("section.desc")}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((pkg, idx) => (
          <FlipCard
            key={`${pkg.name}-${idx}`}
            pkg={pkg}
            startingFromLabel={t("section.startingFrom")}
          />
        ))}
      </div>
    </section>
  );
}

function FlipCard({
  pkg,
  startingFromLabel,
}: {
  pkg: PackageItem;
  startingFromLabel: string;
}) {
  const [flipped, setFlipped] = useState(false);

  const frontBubble =
    "absolute -top-14 -left-14 h-44 w-44 rounded-full blur-[70px] opacity-40 bg-cyan-400";
  const backBubble =
    "absolute -top-14 -right-16 h-56 w-56 rounded-full blur-[90px] opacity-35 bg-fuchsia-500";

  return (
    <div
      className="group relative h-[320px] sm:h-[340px] [perspective:1200px]"
      onMouseLeave={() => setFlipped(false)}
    >
      <button
        type="button"
        aria-label={`Flip ${pkg.name}`}
        onClick={() => setFlipped((v) => !v)}
        className="absolute inset-0 z-10 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      />

      <div
        className={cn(
          "relative h-full w-full rounded-3xl transition-transform duration-700",
          "[transform-style:preserve-3d]",
          "will-change-transform",
          flipped
            ? "[transform:rotateY(180deg)]"
            : "group-hover:[transform:rotateY(180deg)]"
        )}
      >
        {/* FRONT */}
        <div
          className={cn(
            "absolute inset-0 rounded-3xl border border-white/10 bg-slate-900/35 backdrop-blur-xl",
            "shadow-[0_18px_55px_rgba(15,23,42,0.75)]",
            "[backface-visibility:hidden]",
            "overflow-hidden"
          )}
        >
          <div className={frontBubble} />

          <div className="relative h-full p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                <p
                  className={cn(
                    "mt-1 text-sm text-white/60 leading-relaxed",
                    clampTextClass(3)
                  )}
                >
                  {pkg.short}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {startingFromLabel}
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
                  {pkg.priceFrom}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                <span className="min-w-0 break-words">{pkg.tag}</span>
              </li>
            </ul>

            <div className="mt-6" />

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400/0 via-cyan-400/70 to-cyan-400/0" />
          </div>
        </div>

        {/* BACK */}
        <div
          className={cn(
            "absolute inset-0 rounded-3xl border border-white/10 bg-slate-950/45 backdrop-blur-xl",
            "shadow-[0_18px_55px_rgba(15,23,42,0.75)]",
            "[transform:rotateY(180deg)]",
            "[backface-visibility:hidden]",
            "overflow-hidden"
          )}
        >
          <div className={backBubble} />

          <div className="relative h-full p-6 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.25em] text-white/55">
                  Details
                </p>
                <h4 className="mt-2 text-lg font-semibold text-white">
                  {pkg.backTitle}
                </h4>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {startingFromLabel}
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
                  {pkg.priceFrom}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-white/70 overflow-hidden">
              {pkg.backItems.slice(0, 6).map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span className="min-w-0 break-words">{d}</span>
                </li>
              ))}
            </ul>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/70 to-fuchsia-500/0" />
          </div>
        </div>
      </div>
    </div>
  );
}
