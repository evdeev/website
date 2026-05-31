import assert from 'node:assert/strict';
import test from 'node:test';
import { typografText } from '../src/lib/typography.mjs';
import rehypeRussianTypography from '../src/plugins/rehype-russian-typography.mjs';

const nbsp = '\u00a0';

test('binds Russian short words to the following word', () => {
  assert.equal(
    typografText('до дома про сайт по плану но без спешки с другом у дома к вечеру и как получится'),
    `до${nbsp}дома про${nbsp}сайт по${nbsp}плану, но${nbsp}без${nbsp}спешки с${nbsp}другом у${nbsp}дома к${nbsp}вечеру и${nbsp}как${nbsp}получится`,
  );
});

test('binds numbers, units, percentages, number signs and dates', () => {
  assert.equal(typografText('18 м'), `18${nbsp}м`);
  assert.equal(typografText('70 дюймов'), `70${nbsp}дюймов`);
  assert.equal(typografText('125 gr'), `125${nbsp}gr`);
  assert.equal(typografText('36.5 #'), `36.5${nbsp}#`);
  assert.equal(typografText('15 %'), `15${nbsp}%`);
  assert.equal(typografText('№ 125'), `№${nbsp}125`);
  assert.equal(typografText('5 июня 2026'), `5${nbsp}июня${nbsp}2026`);
  assert.equal(typografText('5-10 см'), `5–10${nbsp}см`);
});

test('binds initials and leaves URLs unchanged', () => {
  assert.equal(typografText('Б. Евдеев'), `Б.${nbsp}Евдеев`);
  assert.equal(typografText('А. С. Пушкин'), `А.${nbsp}С.${nbsp}Пушкин`);
  assert.equal(
    typografText('https://example.ru/notes/5-10'),
    'https://example.ru/notes/5-10',
  );
});

test('is idempotent', () => {
  const once = typografText('№ 4: 5-10 см и 15 % до 31 мая 2026');

  assert.equal(typografText(once), once);
});

test('keeps code unchanged and preserves clean heading ids', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'h2',
        children: [{ type: 'text', value: 'Почему я выбрал Astro для личного сайта' }],
      },
      {
        type: 'element',
        tagName: 'code',
        children: [{ type: 'text', value: 'const range = "5-10 см";' }],
      },
    ],
  };

  rehypeRussianTypography()(tree);

  assert.equal(
    tree.children[0].children[0].value,
    `Почему я${nbsp}выбрал Astro для${nbsp}личного сайта`,
  );
  assert.equal(
    tree.children[0].properties.id,
    'почему-я-выбрал-astro-для-личного-сайта',
  );
  assert.equal(tree.children[1].children[0].value, 'const range = "5-10 см";');
});
