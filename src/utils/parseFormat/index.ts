import { inputBlocks } from '@/const/inputBlocks.const';
import { InputBlockType } from '@/enums/InputBlockType';
import disallowedFormatTypes from '@/const/disallowedFormatTypes.const';

const createRegExpByWord = (word: string) => new RegExp(`\\b(${word})\\b`, 'g');

function removeMatches(text: string): string {
  disallowedFormatTypes.forEach(word => {
    text = text.replaceAll(createRegExpByWord(word), '');
  });

  return text;
}

function parsing(value: string) {
  const timeBlocks = new Set<string>([
    InputBlockType.MilitaryHour,
    InputBlockType.SimpleMilitaryHour,
  ]);

  const amPmBlocks = new Set<string>([
    InputBlockType.AmPmUpper,
    InputBlockType.AmPmLower,
  ]);

  let containsTimeBlock = false;
  let containsAmPm = false;
  let containsSomeoneBlock = false;

  for (const block in inputBlocks) {
    if (value.includes(block)) {
      containsSomeoneBlock = true;

      if (timeBlocks.has(block)) {
        containsTimeBlock = true;
      }
      if (amPmBlocks.has(block)) {
        containsAmPm = true;
      }
    }
  }

  if (!containsSomeoneBlock) {
    return '';
  }

  const preparedFormat = removeMatches(value);

  if (containsAmPm && containsTimeBlock) {
    return preparedFormat
      .replaceAll(
        createRegExpByWord(InputBlockType.MilitaryHour),
        InputBlockType.Hour
      )
      .replaceAll(
        createRegExpByWord(InputBlockType.SimpleMilitaryHour),
        InputBlockType.SimpleHour
      );
  }

  return preparedFormat;
}

export function parseFormat(format: unknown, defaultFormat: string): string {
  if (typeof format !== 'string') {
    return defaultFormat;
  }

  const parsedFormat = parsing(format);
  if (!parsedFormat) {
    return typeof defaultFormat === 'string' ? parsing(defaultFormat) : '';
  }

  return parsedFormat;
}
