// Copies the legal texts from the app repo (lifting-app/docs/legal) into the content collection,
// moving each file's title, version and date lines into frontmatter.
// Usage: node scripts/sync-legal.mjs [path to lifting-app/docs/legal]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const source = process.argv[2] ?? '../lifting-app/docs/legal';
const target = 'src/content/legal';
const FILES = {
  de: { terms: 'nutzungsbedingungen.md', privacy: 'datenschutz.md' },
  en: { terms: 'terms.md', privacy: 'privacy.md' },
  'pt-PT': { terms: 'terms.md', privacy: 'privacy.md' },
  'pt-BR': { terms: 'terms.md', privacy: 'privacy.md' },
};

for (const [locale, files] of Object.entries(FILES)) {
  mkdirSync(join(target, locale), { recursive: true });
  for (const [kind, file] of Object.entries(files)) {
    // "# Title", "Version: 1.1", "Stand: 24. Oktober 2026", then the text.
    const [title, version, updated, ...rest] = readFileSync(join(source, locale, file), 'utf8')
      .split(/\n\s*\n/)
      .map((block) => block.trim());
    if (!title.startsWith('# ')) throw new Error(`${locale}/${file}: no title on the first line`);
    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title.slice(2))}`,
      `version: ${JSON.stringify(version.split(':')[1].trim())}`,
      `updated: ${JSON.stringify(updated)}`,
      '---',
    ].join('\n');
    writeFileSync(join(target, locale, `${kind}.md`), `${frontmatter}\n\n${rest.join('\n\n')}\n`);
    console.log(`${locale}/${kind}.md ← ${file}`);
  }
}
