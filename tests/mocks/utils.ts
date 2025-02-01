export const fakeTimeWrapper = async (
  date: Date,
  cb: () => Promise<void> | void
) => {
  vi.useFakeTimers();
  vi.setSystemTime(date);

  await cb();

  vi.useRealTimers();
};

export const fakeTimeZone = (timeZone: string = 'Europe/Kiev') => {
  const originalDateResolvedOptions =
    new Intl.DateTimeFormat().resolvedOptions();

  vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
    ...originalDateResolvedOptions,
    timeZone,
  });
};
