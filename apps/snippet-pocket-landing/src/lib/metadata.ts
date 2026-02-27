import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import {
  defaultLocale,
  getSiteUrl,
  localeLanguageTag,
  publicLocales,
  toPublicLocale,
  type Locale,
} from "@/i18n/config";

export function buildLanguageAlternates(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return Object.fromEntries(
    publicLocales.map((locale) => [
      localeLanguageTag[locale],
      `/${locale}${normalizedPath}`,
    ]),
  );
}

export function getLocaleMetadata(locale: Locale, pathname = ""): Metadata {
  const copy = getMessages(locale);
  const siteUrl = getSiteUrl();
  const ogImage = "https://snippet-link-pocket.netlify.app/icons/icon512.png";
  const routeLocale = toPublicLocale(locale);
  const fullPath = pathname ? `/${routeLocale}${pathname}` : `/${routeLocale}`;
  const canonical = `${siteUrl}${fullPath}`;

  return {
    title: copy.seo.title,
    description: copy.seo.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(pathname),
    },
    openGraph: {
      title: copy.seo.title,
      description: copy.seo.description,
      type: "website",
      locale: localeLanguageTag[routeLocale],
      url: canonical,
      siteName: "Snippet Pocket",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Snippet Pocket",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.seo.title,
      description: copy.seo.description,
      images: [ogImage],
    },
  };
}

export function getDefaultMetadata(): Metadata {
  const copy = getMessages(defaultLocale);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: copy.seo.title,
    description: copy.seo.description,
  };
}
