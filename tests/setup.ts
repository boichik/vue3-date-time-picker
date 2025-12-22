vi.mock('@/composables/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));
