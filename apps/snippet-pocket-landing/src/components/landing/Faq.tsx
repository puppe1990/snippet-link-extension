import type { LocalizedCopy } from "@/i18n/types";

type FaqProps = {
  copy: LocalizedCopy;
};

export function Faq({ copy }: FaqProps) {
  return (
    <section id="faq" className="mt-12">
      <h2 className="text-3xl font-black text-slate-900 md:text-4xl">{copy.faq.title}</h2>
      <div className="mt-6 space-y-3">
        {copy.faq.items.map((item) => (
          <details key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer list-none text-lg font-bold text-slate-900">
              {item.question}
            </summary>
            <p className="mt-3 text-base text-slate-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
