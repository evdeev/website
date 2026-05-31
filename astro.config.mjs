import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeRussianTypography from './src/plugins/rehype-russian-typography.mjs';

export default defineConfig({
  site: 'https://evdeev.ru',
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeRussianTypography],
    }),
  },
});
