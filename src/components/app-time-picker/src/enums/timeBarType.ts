const AppTimeBarType = {
  Hours: 'hours' as const,
  Minutes: 'minutes' as const,
  Seconds: 'seconds' as const,
  AmPm: 'amPm' as const,
};

type AppTimeBarType = (typeof AppTimeBarType)[keyof typeof AppTimeBarType];

export { AppTimeBarType };
