export type LocalizedCopy = {
  seo: {
    title: string;
    description: string;
  };
  nav: {
    product: string;
    pricing: string;
    faq: string;
    openApp: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    socialProof: string;
  };
  benefits: {
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  how: {
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  comparison: {
    title: string;
    freeTitle: string;
    proTitle: string;
    freeItems: string[];
    proItems: string[];
  };
  pricing: {
    title: string;
    subtitle: string;
    priceLabel: string;
    period: string;
    cta: string;
    note: string;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    title: string;
    subtitle: string;
    primaryCta: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
  legal: {
    privacyTitle: string;
    termsTitle: string;
    updatedAt: string;
    privacySections: Array<{ heading: string; body: string }>;
    termsSections: Array<{ heading: string; body: string }>;
  };
};
