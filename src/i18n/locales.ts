/** The site's languages: the app's five. German is the default and lives at the root. */
export const LOCALES = [
  { code: 'de', path: '', short: 'DE', label: 'Deutsch', legal: 'de' },
  { code: 'en', path: 'en', short: 'EN', label: 'English', legal: 'en' },
  { code: 'pt-PT', path: 'pt', short: 'PT', label: 'Português', legal: 'pt-PT' },
  { code: 'pt-BR', path: 'pt-br', short: 'PT-BR', label: 'Português (Brasil)', legal: 'pt-BR' },
  { code: 'ko', path: 'ko', short: 'KO', label: '한국어', legal: 'ko' },
] as const;

export type Locale = (typeof LOCALES)[number];
export type LocaleCode = Locale['code'];
export type Page = 'home' | 'terms' | 'privacy' | 'imprint';

export const DEFAULT_LOCALE = LOCALES[0];

/** URL path of a page in a language: /terms, /en/terms, /en. */
export function pathOf(locale: Locale, page: Page) {
  const parts = [locale.path, page === 'home' ? '' : page].filter(Boolean);
  return `/${parts.join('/')}`;
}

/** getStaticPaths for a page that exists in every language (`[...lang]` routes). */
export const localePaths = () =>
  LOCALES.map((locale) => ({ params: { lang: locale.path || undefined }, props: { locale } }));
