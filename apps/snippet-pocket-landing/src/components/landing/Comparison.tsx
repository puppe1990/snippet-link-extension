import type { LocalizedCopy } from "@/i18n/types";

type ComparisonProps = {
  copy: LocalizedCopy;
};

export function Comparison({ copy }: ComparisonProps) {
  return (
    <section className="mt-12">
      <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{copy.comparison.title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-extrabold text-slate-900">{copy.comparison.freeTitle}</h3>
          <ul className="mt-4 space-y-2 text-base text-slate-700">
            {copy.comparison.freeItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-indigo-50 p-6">
          <h3 className="text-xl font-extrabold text-blue-900">{copy.comparison.proTitle}</h3>
          <ul className="mt-4 space-y-2 text-base text-blue-900">
            {copy.comparison.proItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
