export const isDate = (value: unknown): value is Date => {
  return (
    Boolean(value) &&
    Boolean(value instanceof Date) &&
    !Number.isNaN(new Date(value).valueOf())
  );
};
