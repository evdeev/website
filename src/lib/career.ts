import type { CareerItem } from './domain';

const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

function careerDateValue(value: string): number {
  const [year, month = '01'] = value.split('-');

  return Number(year) * 100 + Number(month);
}

function formatCareerDate(value: string): string {
  const [year, month] = value.split('-');

  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function sortCareerEntries(entries: CareerItem[]): CareerItem[] {
  return entries.sort((a, b) => careerDateValue(b.data.start) - careerDateValue(a.data.start));
}

export function getFeaturedCareer(entries: CareerItem[]): CareerItem {
  const sortedEntries = sortCareerEntries(entries);
  const featuredEntries = sortedEntries.filter(({ data }) => data.featured);
  const currentEntries = sortedEntries.filter(({ data }) => data.end === 'present');
  const entry = featuredEntries[0] ?? currentEntries[0] ?? sortedEntries[0];

  if (!entry) {
    throw new Error('Career collection is empty');
  }

  return entry;
}

export function formatCareerPeriod(start: string, end: string): string {
  const formattedStart = formatCareerDate(start);
  const formattedEnd = end === 'present' ? 'настоящее время' : formatCareerDate(end);

  return `${formattedStart} — ${formattedEnd}`;
}
