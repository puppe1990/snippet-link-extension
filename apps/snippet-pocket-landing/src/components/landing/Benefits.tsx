import type { LocalizedCopy } from "@/i18n/types";

type BenefitsProps = {
  copy: LocalizedCopy;
};

export function Benefits({ copy }: BenefitsProps) {
  return (
    <section id="product" className="mt-10">
      <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{copy.benefits.title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {copy.benefits.items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-base text-slate-700">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
