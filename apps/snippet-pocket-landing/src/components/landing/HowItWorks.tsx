import type { LocalizedCopy } from "@/i18n/types";

type HowItWorksProps = {
  copy: LocalizedCopy;
};

export function HowItWorks({ copy }: HowItWorksProps) {
  return (
    <section className="mt-12 rounded-3xl bg-slate-900 p-8 text-white md:p-10">
      <h2 className="text-3xl font-black md:text-4xl">{copy.how.title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {copy.how.steps.map((step) => (
          <article key={step.title} className="rounded-2xl border border-white/30 bg-white/10 p-5">
            <h3 className="text-lg font-extrabold">{step.title}</h3>
            <p className="mt-2 text-base text-slate-100">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
