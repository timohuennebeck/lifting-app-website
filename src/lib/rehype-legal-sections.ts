import GithubSlugger from 'github-slugger';
import type { Element, ElementContent, Root, RootContent } from 'hast';
import { toString } from 'hast-util-to-string';

import { splitHeading } from './legal-sections';

const element = (
  tagName: string,
  properties: Element['properties'],
  children: ElementContent[],
): Element => ({ type: 'element', tagName, properties, children });

/**
 * Wraps each h2 and everything up to the next one in a <section>, as the legal pages lay them
 * out: the heading's number ("1." in "## 1. Anbieter") moves into its own label.
 */
export function rehypeLegalSections() {
  return (tree: Root) => {
    const slugger = new GithubSlugger();
    const children: RootContent[] = [];
    let section: Element | null = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        const { num, title } = splitHeading(toString(node).trim());
        const heading = element('h2', { id: slugger.slug(title) }, [
          { type: 'text', value: title },
        ]);
        const label = num
          ? [element('span', { className: ['legal-num'] }, [{ type: 'text', value: num }])]
          : [];
        section = element('section', { className: ['legal-section'] }, [
          element('div', { className: ['legal-heading'] }, [...label, heading]),
        ]);
        children.push(section);
      } else if (section) {
        section.children.push(node as ElementContent);
      } else {
        children.push(node);
      }
    }
    tree.children = children;
  };
}
