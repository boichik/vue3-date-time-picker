export const fakeTimeWrapper = async (
  date: Date,
  cb: () => Promise<void> | void
) => {
  vi.useFakeTimers();
  vi.setSystemTime(date);

  await cb();

  vi.useRealTimers();
};
