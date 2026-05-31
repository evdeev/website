import type { CollectionEntry } from 'astro:content';

type Note = CollectionEntry<'notes'>;

const pluralRules = new Intl.PluralRules('ru-RU');

export function sortNotes(notes: Note[]) {
  return notes.sort((a, b) => b.data.created.valueOf() - a.data.created.valueOf());
}

export function formatNoteDate(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date);
}

export function getNotesCountLabel(count: number) {
  const forms = {
    one: 'заметку',
    few: 'заметки',
    many: 'заметок',
    other: 'заметок',
  };

  return `Написал ${count} ${forms[pluralRules.select(count)]}`;
}
