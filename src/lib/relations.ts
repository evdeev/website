import { getCollection, type CollectionEntry } from 'astro:content';

type Note = CollectionEntry<'notes'>;

export async function getRelatedNotes(currentNote: Note): Promise<Note[]> {
  const currentSlug = currentNote.data.slug;
  const series = await getCollection('series');
  const relatedSeries = series.find((item) => item.data.notes.includes(currentSlug));

  if (!relatedSeries) {
    return [];
  }

  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const notesBySlug = new Map(notes.map((note) => [note.data.slug, note]));

  return relatedSeries.data.notes.map((slug) => {
    const note = notesBySlug.get(slug);

    if (!note) {
      throw new Error(`Series "${relatedSeries.id}" references unknown or draft note "${slug}".`);
    }

    return note;
  });
}
