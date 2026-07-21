import Image from "next/image";
import LocaleLink from "./LocaleLink";

type ToolPromoCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  image: string;
};

export default function ToolPromoCard({
  title,
  description,
  buttonLabel,
  href,
  image,
}: ToolPromoCardProps) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-slate-50">
          {title}
        </h3>

        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-slate-300/85 sm:text-[15px]">
          {description}
        </p>

        <LocaleLink
          href={href}
          className="mt-5 inline-flex items-center font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          {buttonLabel} →
        </LocaleLink>
      </div>
    </div>
  );
}