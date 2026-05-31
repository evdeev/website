import GithubSlugger from 'github-slugger';
import { typografText } from '../lib/typography.mjs';

const skippedTags = new Set(['code', 'kbd', 'pre', 'script', 'style']);

function getText(node) {
  if (node.type === 'text') {
    return node.value;
  }

  return node.children?.map(getText).join('') ?? '';
}

function markNumericCell(node) {
  if (!['td', 'th'].includes(node.tagName)) {
    return;
  }

  const text = getText(node).trim();

  if (/^[−+-]?\d[\d\s\u00a0.,]*(?:\s*[%₽$€]|)$/u.test(text)) {
    node.properties ??= {};
    node.properties.className = [...(node.properties.className ?? []), 'numeric'];
  }
}

function addHeadingIds(node, slugger) {
  if (node.type !== 'element' && node.type !== 'root') {
    return;
  }

  if (/^h[1-6]$/u.test(node.tagName)) {
    node.properties ??= {};
    node.properties.id ??= slugger.slug(getText(node));
  }

  for (const child of node.children ?? []) {
    addHeadingIds(child, slugger);
  }
}

function transform(node, parentTag) {
  if (node.type === 'text' && !skippedTags.has(parentTag)) {
    node.value = typografText(node.value);
    return;
  }

  if (node.type !== 'element' && node.type !== 'root') {
    return;
  }

  markNumericCell(node);

  if (skippedTags.has(node.tagName)) {
    return;
  }

  for (const child of node.children ?? []) {
    transform(child, node.tagName);
  }
}

export default function rehypeRussianTypography() {
  return (tree) => {
    addHeadingIds(tree, new GithubSlugger());
    transform(tree);
  };
}
