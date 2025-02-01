const InputBlockType = {
  Year: 'yyyy' as const,
  SimpleYear: 'yy' as const,
  Month: 'MM' as const,
  SimpleMonth: 'M' as const,
  Day: 'dd' as const,
  SimpleDay: 'd' as const,
  Hour: 'hh' as const,
  SimpleHour: 'h' as const,
  MilitaryHour: 'HH' as const,
  SimpleMilitaryHour: 'H' as const,
  Minute: 'mm' as const,
  SimpleMinute: 'm' as const,
  Second: 'ss' as const,
  SimpleSecond: 's' as const,
  Millisecond: 'SSS' as const,
  AmPmUpper: 'a' as const,
  AmPmLower: 'aaa' as const,
};

type InputBlockType = (typeof InputBlockType)[keyof typeof InputBlockType];

export { InputBlockType };
