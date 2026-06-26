import type { CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;
export type CareerItem = CollectionEntry<'career'>;
export type Game = CollectionEntry<'games'>;
export type Book = CollectionEntry<'books'>;

export type Project = {
  title: string;
  slug: string;
  description: string;
  created: Date;
  draft?: boolean;
  url?: string;
  repositoryUrl?: string;
  relatedNotes?: string[];
};

export type RelationTarget = {
  type: 'note' | 'career' | 'project';
  slug: string;
};

export type Author = {
  name: string;
  location: string;
};

export type Collection = {
  title: string;
  description: string;
  href?: string;
};

export type CollectionItem = Game | Book;
