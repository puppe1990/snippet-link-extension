import type { LocalizedCopy } from "@/i18n/types";

type PricingProps = {
  copy: LocalizedCopy;
  appUrl: string;
};

export function Pricing({ copy, appUrl }: PricingProps) {
  return (
    <section id="pricing" className="mt-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white md:p-10">
      <h2 className="text-3xl font-black md:text-4xl">{copy.pricing.title}</h2>
      <p className="mt-3 text-lg text-blue-50">{copy.pricing.subtitle}</p>
      <div className="mt-6 flex flex-wrap items-end gap-2">
        <span className="text-5xl font-black">{copy.pricing.priceLabel}</span>
        <span className="pb-1 text-2xl text-blue-50">{copy.pricing.period}</span>
      </div>
      <a
        href={appUrl}
        className="mt-6 inline-flex rounded-xl border border-slate-300 bg-slate-50 px-6 py-3.5 text-base font-extrabold text-slate-900 shadow-sm transition hover:bg-slate-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.pricing.cta}
      </a>
      <p className="mt-3 text-base text-blue-50">{copy.pricing.note}</p>
    </section>
  );
}
