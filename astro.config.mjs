import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import rehypeRussianTypography from './src/plugins/rehype-russian-typography.mjs';

function cleanSitemapFilename() {
  return {
    name: 'clean-sitemap-filename',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const generatedSitemapPath = join(outDir, 'sitemap-0.xml');
        const cleanSitemapPath = join(outDir, 'sitemap.xml');
        const sitemapIndexPath = join(outDir, 'sitemap-index.xml');

        await rename(generatedSitemapPath, cleanSitemapPath);

        const sitemapIndex = await readFile(sitemapIndexPath, 'utf8');
        await writeFile(
          sitemapIndexPath,
          sitemapIndex.replace('https://evdeev.ru/sitemap-0.xml', 'https://evdeev.ru/sitemap.xml')
        );
      },
    },
  };
}

export default defineConfig({
  site: 'https://evdeev.ru',
  integrations: [sitemap(), cleanSitemapFilename()],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeRussianTypography],
    }),
  },
});
