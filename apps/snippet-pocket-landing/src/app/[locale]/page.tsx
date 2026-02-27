import { Benefits } from "@/components/landing/Benefits";
import { Comparison } from "@/components/landing/Comparison";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { Pricing } from "@/components/landing/Pricing";
import { getPublicAppUrl, type Locale } from "@/i18n/config";
import { getMessages, resolveLocale } from "@/i18n/get-messages";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleLandingPage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam) as Locale;
  const copy = getMessages(locale);
  const appUrl = getPublicAppUrl();

  return (
    <main>
      <div className="mb-4 flex justify-end">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <Hero copy={copy} appUrl={appUrl} />
      <Benefits copy={copy} />
      <HowItWorks copy={copy} />
      <Comparison copy={copy} />
      <Pricing copy={copy} appUrl={appUrl} />
      <Faq copy={copy} />
      <FinalCta copy={copy} appUrl={appUrl} />
      <Footer locale={locale} copy={copy} />
    </main>
  );
}
