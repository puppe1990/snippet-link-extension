import type { LocalizedCopy } from "@/i18n/types";

type HeroProps = {
  copy: LocalizedCopy;
  appUrl: string;
};

export function Hero({ copy, appUrl }: HeroProps) {
  return (
    <section className="rounded-3xl border border-white/50 bg-white/95 p-8 shadow-2xl backdrop-blur md:p-12">
      <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-blue-800">
        {copy.hero.badge}
      </span>

      <h1 className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
        {copy.hero.title}
      </h1>

      <p className="mt-4 max-w-3xl text-xl text-slate-700 md:text-2xl">
        {copy.hero.subtitle}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={appUrl}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:brightness-110"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.hero.primaryCta}
        </a>
        <a
          href="#pricing"
          className="rounded-xl border border-slate-400 bg-slate-50 px-6 py-3.5 text-base font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 hover:border-slate-600"
        >
          {copy.hero.secondaryCta}
        </a>
      </div>

      <p className="mt-6 text-base font-medium text-slate-600">{copy.hero.socialProof}</p>
    </section>
  );
}
