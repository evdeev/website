import type { Collection } from './domain';

export const collections: Collection[] = [
  {
    title: 'Игры',
    description: 'Игры, в которые играл, с оценками и количеством прохождений.',
    href: '/lists/games',
  },
  {
    title: 'Книги',
    description: 'Книги, которые прочитал и решил сохранить.',
    href: '/lists/books',
  },
  {
    title: 'Фильмы',
    description: 'Фильмы, которые стоит пересмотреть.',
  },
  {
    title: 'Вишлист',
    description: 'Вещи, которые хотелось бы купить или получить в подарок.',
  },
];
