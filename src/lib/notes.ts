import type { CollectionEntry } from 'astro:content';

type Note = CollectionEntry<'notes'>;

export function sortNotes(notes: Note[]) {
  return notes.sort((a, b) => a.data.created.valueOf() - b.data.created.valueOf());
}

export function formatNoteDate(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date);
}
