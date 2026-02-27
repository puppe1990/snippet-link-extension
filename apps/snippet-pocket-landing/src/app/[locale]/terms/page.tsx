import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, resolveLocale } from "@/i18n/get-messages";
import { type Locale } from "@/i18n/config";
import { getLocaleMetadata } from "@/lib/metadata";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  return getLocaleMetadata(resolveLocale(localeParam), "/terms");
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam) as Locale;
  const copy = getMessages(locale);

  return (
    <main className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">{copy.legal.termsTitle}</h1>
      <p className="mt-2 text-sm text-slate-500">{copy.legal.updatedAt}</p>

      <div className="mt-6 space-y-5">
        {copy.legal.termsSections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
            <p className="mt-2 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>

      <Link href={`/${locale}`} className="mt-8 inline-flex text-sm font-bold text-blue-700 hover:underline">
        ← Snippet Pocket
      </Link>
    </main>
  );
}
