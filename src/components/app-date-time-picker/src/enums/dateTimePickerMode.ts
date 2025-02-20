const AppDateTimePickerMode = {
  Day: 'day' as const,
  Year: 'year' as const,
  Month: 'month' as const,
};

type AppDateTimePickerMode =
  (typeof AppDateTimePickerMode)[keyof typeof AppDateTimePickerMode];

export { AppDateTimePickerMode };
