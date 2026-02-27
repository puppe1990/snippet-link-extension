export const locales = ["pt-BR", "pt-br", "en", "fr"] as const;
export const publicLocales = ["pt-br", "en", "fr"] as const;

export type Locale = (typeof locales)[number];
export type PublicLocale = (typeof publicLocales)[number];

export const defaultLocale: Locale = "pt-BR";

export const localeLabels: Record<Locale, string> = {
  "pt-BR": "Português",
  "pt-br": "Português",
  en: "English",
  fr: "Français",
};

export const localeLanguageTag: Record<PublicLocale, string> = {
  "pt-br": "pt-BR",
  en: "en",
  fr: "fr",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function toPublicLocale(locale: Locale): PublicLocale {
  if (locale === "pt-BR") return "pt-br";
  return locale as PublicLocale;
}

export function getPublicAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://snippet-link-pocket.netlify.app/mobile-app.html"
  );
}

export function getDefaultLocaleFromEnv(): Locale {
  const value = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  if (value && isLocale(value)) return value;
  return defaultLocale;
}

export function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return stripTrailingSlash(envUrl || "https://snippet-pocket-landing.netlify.app");
}
