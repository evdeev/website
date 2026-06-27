import Typograf from 'typograf';

const typograf = new Typograf({ locale: ['ru', 'en-US'] });

const nbsp = '\u00a0';
const spaces = '[ \\t\\u00a0\\u202f]';
const boundWords = [
  'а',
  'без',
  'в',
  'во',
  'да',
  'для',
  'до',
  'за',
  'и',
  'из',
  'или',
  'к',
  'как',
  'ко',
  'ли',
  'либо',
  'на',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'про',
  'с',
  'со',
  'у',
  'что',
  'чем',
];

const boundWordPattern = new RegExp(
  `(^|[\\s([{«„])(${boundWords.join('|')})${spaces}+(?=\\S)`,
  'giu',
);
const numericRangePattern = /(\d)\s*-\s*(?=\d)/gu;
const numberPattern = String.raw`\d+(?:[.,]\d+)?(?:[–—-]\d+(?:[.,]\d+)?)?`;
const unitPattern = [
  'дюйм(?:а|ов)?',
  'раз(?:а|ов)?',
  'кг',
  'мг',
  'км',
  'мм',
  'см',
  'м[²³]?',
  'мл',
  'л',
  'гр',
  'gr',
  'px',
  '#',
].join('|');
const numberUnitPattern = new RegExp(
  `(${numberPattern})${spaces}+(${unitPattern})(?=\\s|[.,;:!?)]|$)`,
  'giu',
);
const percentPattern = new RegExp(`(${numberPattern})${spaces}*%`, 'gu');
const numberSignPattern = new RegExp(`№${spaces}*(?=\\d)`, 'gu');
const monthPattern =
  /(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)/giu;
const datePattern = new RegExp(
  `(\\d{1,2})${spaces}+${monthPattern.source}(?:${spaces}+(\\d{4})(?!\\d))?`,
  'giu',
);
const initialsPattern = new RegExp(
  `(^|[^\\p{L}])([А-ЯЁA-Z])\\.${spaces}+(?=[А-ЯЁA-Z](?:[а-яёa-z]+|\\.))`,
  'gu',
);
const urlPattern = /\b(?:https?:\/\/|www\.)[^\s<]+/giu;
const finalRomanNumeralPattern = /([\p{L}])(?:[ \t\u00a0\u202f])+([IVXLCDM]{1,8})(?=$|[.,;:!?)]|\s)/gu;


function bindShortWords(text) {
  return text.replace(boundWordPattern, `$1$2${nbsp}`);
}

function normalizeNumericRanges(text) {
  return text.replace(numericRangePattern, '$1–');
}

function bindNumbers(text) {
  return text
    .replace(numberSignPattern, `№${nbsp}`)
    .replace(initialsPattern, `$1$2.${nbsp}`)
    .replace(datePattern, (_, day, month, year) =>
      year ? `${day}${nbsp}${month}${nbsp}${year}` : `${day}${nbsp}${month}`,
    )
    .replace(percentPattern, `$1${nbsp}%`)
    .replace(numberUnitPattern, `$1${nbsp}$2`);
}

function bindFinalRomanNumerals(text) {
  return text.replace(finalRomanNumeralPattern, `$1${nbsp}$2`);
}

function protectUrls(text, transform) {
  const urls = [];
  const protectedText = text.replace(urlPattern, (url) => {
    urls.push(url);
    return `\uE000${urls.length - 1}\uE001`;
  });

  return transform(protectedText).replace(/\uE000(\d+)\uE001/gu, (_, index) => urls[index]);
}

function typografText(text, { preserveBreakingSpaces = false } = {}) {
  const leadingSpace = text.match(/^\s+/u)?.[0] ?? '';
  const trailingSpace = text.match(/\s+$/u)?.[0] ?? '';
  const end = trailingSpace ? -trailingSpace.length : undefined;
  const content = text.slice(leadingSpace.length, end);

  if (!content) {
    return text;
  }

  let result = protectUrls(content, (protectedText) =>
    bindFinalRomanNumerals(bindNumbers(normalizeNumericRanges(bindShortWords(typograf.execute(protectedText))))),
  );

  if (preserveBreakingSpaces) {
    result = result.replace(/[\u00a0\u202f]/gu, ' ');
  }

  return leadingSpace + result + trailingSpace;
}

export { bindShortWords, normalizeNumericRanges, typografText };
