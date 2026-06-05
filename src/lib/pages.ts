import { getEntry, render } from 'astro:content';

export async function getPageContent(id: string) {
  const page = await getEntry('pages', id);

  if (!page) {
    throw new Error(`Page content "${id}" is missing`);
  }

  const { Content } = await render(page);
  const hasContent = (page.body ?? '').trim().length > 0;

  return { page, Content, hasContent };
}
