import { defaultLocale, isLocale, type Locale } from "./config";
import { en } from "./messages/en";
import { fr } from "./messages/fr";
import { ptBR } from "./messages/pt-BR";
import type { LocalizedCopy } from "./types";

const dictionaries: Record<Locale, LocalizedCopy> = {
  "pt-BR": ptBR,
  "pt-br": ptBR,
  en,
  fr,
};

export function resolveLocale(input: string): Locale {
  if (isLocale(input)) return input;
  return defaultLocale;
}

export function getMessages(locale: Locale): LocalizedCopy {
  return dictionaries[locale];
}
