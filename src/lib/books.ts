import type { Book } from './domain';

const statusLabels = ['прочитано', 'читаю', 'в очереди', 'бросил'] as const;

export function sortBooksByStatusOrder(books: Book[]) {
  return books.sort((a, b) => (
    a.data.status_order - b.data.status_order
    || a.data.id - b.data.id
  ));
}

export function getBooksSummary(books: Book[]) {
  const counts = Object.fromEntries(statusLabels.map((status) => [status, 0])) as Record<typeof statusLabels[number], number>;

  for (const book of books) {
    counts[book.data.status] += 1;
  }

  return [
    formatBooksCount(books.length),
    `${counts['прочитано']} прочитано`,
    `${counts['читаю']} читаю`,
    `${counts['в очереди']} в очереди`,
    `${counts['бросил']} бросил`,
  ].join(' · ');
}

function formatBooksCount(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} книг`;
  }

  if (lastDigit === 1) {
    return `${count} книга`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} книги`;
  }

  return `${count} книг`;
}

export function formatBookStatus(status: Book['data']['status']) {
  return status.slice(0, 1).toLocaleUpperCase('ru-RU') + status.slice(1);
}
