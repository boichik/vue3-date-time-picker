export const isDate = (value: unknown): value is Date => {
  return (
    Boolean(value) &&
    value instanceof Date &&
    !Number.isNaN(new Date(value).valueOf())
  );
};
