import { InputBlockType } from '../enums/InputBlockType';
import { IMask } from 'vue-imask';

export interface InputBlock {
  mask: unknown;
  from?: number;
  to?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  enum?: string[];
}

export const inputBlocks: Record<string, InputBlock> = {
  [InputBlockType.SimpleYear]: {
    mask: IMask.MaskedRange,
    from: 0,
    to: 99,
    maxLength: 2,
  },
  [InputBlockType.Year]: {
    mask: IMask.MaskedRange,
    from: 0,
    to: 9999,
    maxLength: 4,
  },
  [InputBlockType.SimpleMonth]: {
    mask: IMask.MaskedNumber,
    min: 1,
    max: 12,
  },
  [InputBlockType.Month]: {
    mask: IMask.MaskedRange,
    from: 1,
    to: 12,
    maxLength: 2,
  },
  [InputBlockType.SimpleDay]: {
    mask: IMask.MaskedNumber,
    min: 1,
    max: 31,
  },
  [InputBlockType.Day]: {
    mask: IMask.MaskedRange,
    from: 1,
    to: 31,
    maxLength: 2,
  },
  [InputBlockType.SimpleMilitaryHour]: {
    mask: IMask.MaskedNumber,
    min: 0,
    max: 23,
  },
  [InputBlockType.MilitaryHour]: {
    mask: IMask.MaskedRange,
    from: 0,
    to: 23,
    maxLength: 2,
  },
  [InputBlockType.SimpleHour]: {
    mask: IMask.MaskedNumber,
    min: 1,
    max: 12,
  },
  [InputBlockType.Hour]: {
    mask: IMask.MaskedRange,
    from: 1,
    to: 12,
    maxLength: 2,
  },
  [InputBlockType.SimpleMinute]: {
    mask: IMask.MaskedNumber,
    min: 0,
    max: 59,
  },
  [InputBlockType.Minute]: {
    mask: IMask.MaskedRange,
    from: 0,
    to: 59,
    maxLength: 2,
  },
  [InputBlockType.SimpleSecond]: {
    mask: IMask.MaskedNumber,
    min: 0,
    max: 59,
  },
  [InputBlockType.Second]: {
    mask: IMask.MaskedRange,
    from: 0,
    to: 59,
    maxLength: 2,
  },
  [InputBlockType.Millisecond]: {
    mask: IMask.MaskedRange,
    from: 0,
    to: 999,
    maxLength: 3,
  },
  [InputBlockType.AmPmLower]: {
    mask: IMask.MaskedEnum,
    enum: ['am', 'pm'],
  },
  [InputBlockType.AmPmUpper]: {
    mask: IMask.MaskedEnum,
    enum: ['AM', 'PM'],
  },
};
