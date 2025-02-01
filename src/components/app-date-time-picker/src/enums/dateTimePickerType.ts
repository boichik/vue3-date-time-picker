const AppDateTimePickerType = {
  Date: 'date' as const,
  DateTime: 'datetime' as const,
  DateRange: 'daterange' as const,
  DateTimeRange: 'datetimerange' as const,
};

type AppDateTimePickerType =
  (typeof AppDateTimePickerType)[keyof typeof AppDateTimePickerType];

export { AppDateTimePickerType };
