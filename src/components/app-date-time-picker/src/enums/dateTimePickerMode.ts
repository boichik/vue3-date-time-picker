const DateTimePickerMode = {
  Day: 'day' as const,
  Year: 'year' as const,
  Month: 'month' as const,
};

type DateTimePickerMode =
  (typeof DateTimePickerMode)[keyof typeof DateTimePickerMode];

export { DateTimePickerMode };
