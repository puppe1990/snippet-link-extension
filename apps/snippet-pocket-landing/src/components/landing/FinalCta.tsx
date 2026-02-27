import type { LocalizedCopy } from "@/i18n/types";

type FinalCtaProps = {
  copy: LocalizedCopy;
  appUrl: string;
};

export function FinalCta({ copy, appUrl }: FinalCtaProps) {
  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 text-center md:p-10">
      <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{copy.finalCta.title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-base text-slate-700">{copy.finalCta.subtitle}</p>
      <a
        href={appUrl}
        className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:brightness-110"
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.finalCta.primaryCta}
      </a>
    </section>
  );
}
