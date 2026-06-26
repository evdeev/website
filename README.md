# evdeev.ru

Личный статический сайт на [Astro](https://astro.build/). Контент хранится в Markdown, сайт собирается без CMS и базы данных, а публикация выполняется через GitHub Pages.

## Локальный запуск

Понадобится Node.js 22.12.0 или новее.

```sh
npm install
npm run dev
```

После запуска сайт доступен по адресу `http://localhost:4321`.

Проверить production-сборку:

```sh
npm run build
npm run preview
```

## Структура проекта

```text
src/
  components/
    career/
      CareerItem.astro
      CareerTimeline.astro
    intro/
      PageIntro.astro
    lists/
      CollectionCard.astro
      CollectionList.astro
      GameItem.astro
    navigation/
      Footer.astro
      Header.astro
      SiteNav.astro
      SectionAction.astro
    notes/
      NoteCard.astro
      NoteHeader.astro
      NoteNavigation.astro
      Prose.astro
      RelatedNotes.astro
    YandexMetrika.astro
  content/
    pages/
      home.md
      notes.md
      career.md
      lists.md
      games.md
      policy.md
      manifesto.md
    career/
      2026-alfa-bank-digital-credit-products.md
      2024-alfa-bank-b2b-credit.md
    notes/
      write-to-save-conclusions/
        index.md
      why-i-chose-astro/
        index.md
    series/
      interests-and-hobbies.yaml
    lists/
      games/
        astro-bot.md
        ghost-of-yotei.md
    projects/
      .gitkeep
  layouts/
    BaseLayout.astro
    PageLayout.astro
    NoteLayout.astro
  lib/
    author.ts
    career.ts
    collections.ts
    domain.ts
    games.ts
    lists.ts
    notes.ts
    pages.ts
    projects.ts
    relations.ts
    typography.mjs
  styles/
    colors.css
    components.css
    global.css
    layout.css
    links.css
    tokens.css
    typography.css
    utilities.css
  pages/
    index.astro
    career.astro
    lists.astro
    manifesto.astro
    policy.astro
    lists/
      games.astro
    notes/
      index.astro
      [slug].astro
```

В `src/content.config.ts` определены пять Astro Content Collections:

- `pages` для обычных страниц;
- `notes` для заметок;
- `series` для редакторских серий связанных заметок;
- `career` для мест работы;
- `games` для списка игр.

Layouts выбираются программно в Astro-страницах, а не через frontmatter. Переиспользуемые
блоки интерфейса находятся в `src/components/` и сгруппированы по смысловым сущностям сайта:
`intro`, `navigation`, `notes`, `career`, `lists`.

Доменная модель сайта описана в `src/lib/domain.ts`. Заметки остаются центральной сущностью,
а `src/lib/relations.ts` уже выделяет слой для связей между заметками. Для будущего раздела
проектов подготовлены тип `Project`, `src/lib/projects.ts` и папка `src/content/projects/`, но
публичный маршрут проектов пока не добавлен.

## Страницы

Главная страница редактируется в `src/content/pages/home.md`: поля `lead` и `personal`
управляют двумя текстовыми строками в первом экране. Страницы `/notes`, `/career`,
`/lists`, `/lists/games`, `/policy` и `/manifesto` берут текст и метаданные из
`src/content/pages/*.md`.

Раздел карьеры автоматически собирается из файлов `src/content/career/*.md`. Список игр
на `/lists/games` собирается из файлов `src/content/lists/games/*.md`.

Формат:

```md
---
title: Заголовок
description: Краткое описание
intro: Лид страницы
---

Текст страницы...
```

HTML-тег `<title>` задаётся человекочитаемой фразой, без универсального шаблона с тире:

| Страница | `<title>` |
| --- | --- |
| Главная | `Борис Евдеев` |
| Заметки | `Заметки Бориса Евдеева` |
| Карьера | `Карьера Бориса Евдеева` |
| Списки | `Списки Бориса Евдеева` |
| Игры | `Игры Бориса Евдеева` |
| Политика конфиденциальности | `Политика конфиденциальности Бориса Евдеева` |
| Манифест заметок | `Манифест заметок Бориса Евдеева` |
| Отдельная заметка | Заголовок заметки |

Страница `/manifesto` служебная: она не добавляется в основную навигацию, футер, список заметок,
sitemap или RSS. Для неё включён `noindex` через `PageLayout` и исключение из sitemap в
`astro.config.mjs`.

Внутренние страницы основных разделов могут включать боковую навигацию через параметры layout:
`siteNavSection="notes" | "career" | "lists"` и `siteNavDepth="section" | "item"`.
На широких экранах `SiteNav.astro` показывает фиксированную левую навигацию, на мобильных -
компактный блок перед футером.

## Новая заметка

Для каждой заметки нужна отдельная папка. Благодаря этому рядом с текстом можно хранить изображения и вложения.

1. Создайте папку:

   ```sh
   mkdir -p src/content/notes/my-note
   ```

2. Создайте в ней `index.md`.

3. Добавьте frontmatter:

   ```md
   ---
   title: Заголовок заметки
   slug: my-note
   topic: Тема заметки
   status: published
   description: Краткое описание заметки
   intro: Лид заметки, который выводится под заголовком
   created: '2026-05-31 12:00:00'
   updated: '2026-05-31 18:30:00'
   draft: false
   tags:
     - пример
   cover: ''
   ---

   Текст заметки...
   ```

4. Напишите текст, сделайте commit и push.

Заметка появится по адресу `/notes/my-note`. Если указать `draft: true`, она не попадёт в сборку сайта.

Перед написанием или редактированием заметки полезно свериться с `/manifesto`: заметка должна
держаться на одной главной мысли, показывать путь к выводу и сохранять наблюдение с долгосрочной
ценностью, а не просто описывать событие.

Вложения можно размещать рядом:

```text
src/content/notes/my-note/
  index.md
  cover.jpg
  screenshot.png
  file.pdf
```

Поле `cover` уже предусмотрено схемой. Его можно оставить пустым до появления обложки.

Поле `created` хранит дату и время создания заметки в московском времени. Используйте формат
`'YYYY-MM-DD HH:mm:ss'` и оставляйте значение в кавычках, чтобы Markdown-парсер не превратил его
в UTC-дату. Поле используется для обратной хронологической сортировки от новых заметок к старым,
но на сайте отображается только дата. Необязательное поле `updated`
можно добавить при изменении заметки в том же формате.

## Серии заметок

Серии — отдельная редакторская связь между заметками, независимая от тем. Заметки не хранят
ссылки на серии и не знают о соседних материалах.

Каждая серия хранится отдельным YAML-файлом в `src/content/series/`:

```yaml
title: Интересы и увлечения
notes:
  - interests-have-their-time
  - photography-helps-preserve-time
```

Поле `notes` содержит slug заметок в каноническом порядке серии. Если текущая заметка входит
в серию, компонент `RelatedNotes` автоматически выводит весь список в конце статьи.

## Новая запись карьеры

Каждое место работы хранится отдельным Markdown-файлом в `src/content/career/`. Страница
`/career` автоматически сортирует записи от новых к старым. Главная страница показывает
короткий тизер записи с `featured: true`.

```md
---
title: Компания
headline: Публичное название этапа
official_role: Официальная должность
start: 2024-03
end: present
summary: Короткое описание для превью.
company_url: https://example.com
location: Москва
featured: true
---

## Чем занимался

Подробности этапа карьеры.
```

Даты задаются в формате `YYYY` или `YYYY-MM`. Для текущего места работы используйте
`end: present`. Поле `company_url` необязательно.

## Публикация на GitHub Pages

Workflow `.github/workflows/deploy.yml` автоматически собирает и публикует сайт после каждого push в ветку `master`.
Папка сайта должна быть корнем отдельного GitHub-репозитория: workflow ищется именно относительно
корня репозитория.

Перед первой публикацией:

1. Создайте GitHub-репозиторий и отправьте в него проект.
2. В настройках репозитория откройте **Settings → Pages**.
3. В поле **Source** выберите **GitHub Actions**.
4. Настройте DNS для домена `evdeev.ru`.

Файл `public/CNAME` уже содержит домен `evdeev.ru`, а `astro.config.mjs` настроен для этого адреса.

Обычный flow публикации заметки:

1. Создать `src/content/notes/my-note/index.md`.
2. Заполнить frontmatter.
3. Написать текст.
4. Сделать commit и push.
5. Дождаться автоматической публикации GitHub Pages.

Дополнительных действий для каждой заметки не требуется.

## Списки и игры

Раздел `/lists` показывает список тематических подборок. Доступные и будущие страницы задаются в
`src/lib/collections.ts`. `src/lib/lists.ts` оставлен как совместимый алиас:

```ts
export const collections = [
  {
    title: 'Игры',
    description: 'Личный список игр, в которые я играл, с оценками и количеством прохождений.',
    href: '/lists/games',
  },
  {
    title: 'Книги',
    description: 'Книги, которые хочется сохранить и к которым стоит возвращаться.',
  },
];
```

Игры хранятся отдельными Markdown-файлами в `src/content/lists/games/`, а обложки лежат в
`public/images/games/`. Страница `/lists/games` сортирует игры по году релиза и показывает общее
количество игр и период.

Минимальный формат записи:

```md
---
title: Astro Bot
developers:
  - name: Team Asobi
    url: https://www.teamasobi.com/
releaseYear: 2024
rating: 10
status: Пройдено
playthroughs: 1
cover: /images/games/astro-bot.webp
---
```

## Стили

Глобальные стили подключаются через `src/styles/global.css`, который служит точкой сборки CSS-слоёв.
Файл встраивается в `<head>` через `BaseLayout.astro`, чтобы браузер применял оформление до первого
кадра и не показывал скачок стилей.

Слои:

- `tokens.css` — шрифты, цвета, интервалы, размеры текста и контейнеров;
- `colors.css` — применение цветовых токенов к базовым элементам;
- `typography.css` — базовая типографика и prose-стили заметок;
- `links.css` — единая система ссылок;
- `layout.css` — контейнеры и базовая раскладка;
- `components.css` — стили смысловых компонентов;
- `utilities.css` — служебные классы и accessibility overrides.

Новые стили добавляйте в существующий слой по смыслу. Не создавайте компоненты только ради HTML-тегов:
типографика длинных материалов должна оставаться в `Prose`, а повторяемые блоки — в компонентах
сущностей (`NoteCard`, `CareerItem`, `CollectionCard`, `SectionAction`).

## Настройки списка заметок

Количество заметок, которые отображаются до кнопки «Показать ещё», задаётся в `src/site.config.ts`:

```ts
export const siteConfig = {
  notes: {
    initialVisibleCount: 50,
  },
};
```

На странице заметки автоматически добавляются ссылки на следующую и предыдущую публикацию, если они существуют.

## Автоматическая типографика

При каждой сборке Markdown автоматически проходит через `src/plugins/rehype-russian-typography.mjs`. Те же правила применяются к заголовкам и описаниям из frontmatter. В исходном тексте можно писать быстро, используя обычные кавычки и дефисы: опубликованная HTML-страница получит типографские кавычки, тире, апострофы и неразрывные пробелы.

Дополнительно связываются с последующим словом короткие служебные слова, включая `не`, `как`, `что`, `для`, `при` и распространённые союзы и предлоги. Содержимое блоков `code` и `pre` не изменяется.

Для таблиц текстовые ячейки выравниваются влево, а ячейки с числами автоматически получают выравнивание вправо.

Проверить правила типографики:

```sh
npm test
```
