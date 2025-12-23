// app/components/PricingFlipCards.tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type PackageItem = {
  id: string;
  accent: "cyan" | "fuchsia";
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
    () => [
      { id: "wordpress", accent: "cyan" },
      { id: "woocommerce", accent: "fuchsia" },
      { id: "shopify", accent: "cyan" },
      { id: "nextjs", accent: "fuchsia" },
      { id: "saas", accent: "cyan" },
    ],
    []
  );

  return (
    <section className="mt-14">
      <div>
        <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
          {t("title")}
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white">
          {t("subtitle")}
        </h2>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((pkg) => (
          <FlipCard
            key={pkg.id}
            pkg={pkg}
            startingFrom={t("startingFrom")}
            title={t(`cards.${pkg.id}.title`)}
            subtitle={t(`cards.${pkg.id}.subtitle`)}
            price={t(`cards.${pkg.id}.price`)}
            detailsTitle={t("detailsTitle")}
            details={(t.raw(`cards.${pkg.id}.features`) as string[]) || []}
            note={t(`cards.${pkg.id}.note`)}
          />
        ))}
      </div>
    </section>
  );
}

function FlipCard({
  pkg,
  startingFrom,
  title,
  subtitle,
  price,
  detailsTitle,
  details,
  note,
}: {
  pkg: { id: string; accent: "cyan" | "fuchsia" };
  startingFrom: string;
  title: string;
  subtitle: string;
  price: string;
  detailsTitle: string;
  details: string[];
  note?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  // Turcoaz pe fata + turcoaz pe spate (cum ai cerut)
  const bubbleFront =
    "absolute -top-14 -left-14 h-44 w-44 rounded-full blur-[70px] opacity-40 bg-cyan-400";
  const bubbleBack =
    "absolute -top-14 -right-16 h-56 w-56 rounded-full blur-[90px] opacity-35 bg-cyan-400";

  return (
    <div
      className="group relative h-[320px] sm:h-[340px] [perspective:1200px]"
      onMouseLeave={() => setFlipped(false)}
    >
      <button
        type="button"
        aria-label={`Flip ${title}`}
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
          <div className={bubbleFront} />

          <div className="relative h-full p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p
                  className={cn(
                    "mt-1 text-sm text-white/60 leading-relaxed",
                    clampTextClass(3)
                  )}
                >
                  {subtitle}
                </p>
              </div>

              {/* Right aligned */}
              <div className="shrink-0 text-right">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {startingFrom}
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
                  {price}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {details.slice(0, 3).map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span className="min-w-0 break-words">{b}</span>
                </li>
              ))}
            </ul>

            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px]",
                pkg.accent === "cyan"
                  ? "bg-gradient-to-r from-cyan-400/0 via-cyan-400/70 to-cyan-400/0"
                  : "bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/70 to-fuchsia-500/0"
              )}
            />
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
          <div className={bubbleBack} />

          <div className="relative h-full p-6 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.25em] text-white/55">
                  {detailsTitle}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-white">
                  {title}
                </h4>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {startingFrom}
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
                  {price}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-white/70 overflow-hidden">
              {details.slice(0, 6).map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span className="min-w-0 break-words">{d}</span>
                </li>
              ))}
            </ul>

            {note ? (
              <div className="mt-auto pt-4">
                <p className="text-xs text-white/55 leading-relaxed max-h-[2.8em] overflow-hidden">
                  {note}
                </p>
              </div>
            ) : null}

            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px]",
                pkg.accent === "cyan"
                  ? "bg-gradient-to-r from-cyan-400/0 via-cyan-400/70 to-cyan-400/0"
                  : "bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/70 to-fuchsia-500/0"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
