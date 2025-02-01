export const isDate = (value: unknown): value is Date => {
  return (
    !!value &&
    !!(value instanceof Date) &&
    !Number.isNaN(new Date(value).valueOf())
  );
};
