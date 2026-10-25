import GithubSlugger from 'github-slugger';

export interface LegalSection {
  /** "1" for "## 1. Anbieter und Geltungsbereich"; null for an unnumbered heading. */
  num: string | null;
  title: string;
  slug: string;
}

/** Splits a "## 1. Title" heading text into its number and title. */
export function splitHeading(text: string) {
  const match = /^(\d+)\.\s+(.*)$/.exec(text);
  return match ? { num: match[1], title: match[2] } : { num: null, title: text };
}

/** The `##` sections of a legal text, with the ids rehypeLegalSections gives them. */
export function legalSections(markdown: string): LegalSection[] {
  const slugger = new GithubSlugger();
  return [...markdown.matchAll(/^## (.+)$/gm)].map(([, text]) => {
    const { num, title } = splitHeading(text.trim());
    return { num, title, slug: slugger.slug(title) };
  });
}
