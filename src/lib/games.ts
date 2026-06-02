import type { CollectionEntry } from 'astro:content';

type Game = CollectionEntry<'games'>;

const titleCollator = new Intl.Collator('ru-RU');

export function sortGamesByReleaseYear(games: Game[]) {
  return games.sort((a, b) => (
    b.data.releaseYear - a.data.releaseYear
    || titleCollator.compare(a.data.title, b.data.title)
  ));
}

export function getGamesPeriod(games: Game[]) {
  const years = games.map((game) => game.data.releaseYear);

  return `${Math.min(...years)}—${Math.max(...years)}`;
}

export function formatGamesCount(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} игр`;
  }

  if (lastDigit === 1) {
    return `${count} игра`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} игры`;
  }

  return `${count} игр`;
}

export function formatPlaythroughs(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} раз`;
  }

  if (lastDigit === 1) {
    return `${count} раз`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} раза`;
  }

  return `${count} раз`;
}
