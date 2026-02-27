import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { LocalizedCopy } from "@/i18n/types";

type FooterProps = {
  locale: Locale;
  copy: LocalizedCopy;
};

export function Footer({ locale, copy }: FooterProps) {
  return (
    <footer className="mt-14 border-t border-slate-300 py-6 text-base text-slate-600">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>{copy.footer.rights}</p>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/privacy`} className="hover:text-slate-900">
            {copy.footer.privacy}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-slate-900">
            {copy.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}
