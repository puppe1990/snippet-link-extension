import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMessages, resolveLocale } from "@/i18n/get-messages";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getLocaleMetadata } from "@/lib/metadata";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  return getLocaleMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  if (localeParam !== locale && locale === defaultLocale) {
    redirect(`/${defaultLocale}`);
  }

  const copy = getMessages(locale as Locale);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,#60a5fa22_0%,transparent_45%),radial-gradient(circle_at_100%_0%,#6366f122_0%,transparent_50%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-4 rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-sm font-bold text-slate-700 backdrop-blur">
          {copy.hero.badge}
        </div>
        {children}
      </div>
    </div>
  );
}
