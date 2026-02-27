import type { MetadataRoute } from "next";
import { getSiteUrl, localeLanguageTag, publicLocales } from "@/i18n/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return publicLocales.flatMap((locale) => {
    const root = `${siteUrl}/${locale}`;

    return [
      {
        url: root,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
        alternates: {
          languages: Object.fromEntries(
            publicLocales.map((altLocale) => [
              localeLanguageTag[altLocale],
              `${siteUrl}/${altLocale}`,
            ]),
          ),
        },
      },
      {
        url: `${root}/privacy`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: `${root}/terms`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ];
  });
}
