import Link from "next/link";
import {
  localeLabels,
  publicLocales,
  toPublicLocale,
  type Locale,
} from "@/i18n/config";

type LanguageSwitcherProps = {
  currentLocale: Locale;
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const currentPublicLocale = toPublicLocale(currentLocale);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {publicLocales.map((locale) => {
        const isActive = locale === currentPublicLocale;

        return (
          <Link
            key={locale}
            href={`/${locale}`}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              isActive
                ? "bg-slate-900 text-white shadow-md"
                : "border border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
            }`}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
