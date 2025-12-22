import { describe, it, expect, vi, beforeEach } from 'vitest';

const useI18nMock = vi.fn();

vi.unmock('@/composables/useLocalization');

vi.mock('vue-i18n', () => ({
  useI18n: useI18nMock,
}));

describe('useLocalization', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should return i18n instance when useI18n succeeds', async () => {
    const mockI18n = { t: vi.fn(), locale: 'en' };
    useI18nMock.mockReturnValue(mockI18n);

    const { useLocalization } = await import('./index');
    const result = useLocalization();

    expect(result).toEqual(mockI18n);
    expect(useI18nMock).toHaveBeenCalledWith({ useScope: 'global' });
  });

  it('should return undefined when useI18n throws an error', async () => {
    useI18nMock.mockImplementation(() => {
      throw new Error('i18n not configured');
    });

    const { useLocalization } = await import('./index');
    const result = useLocalization();

    expect(result).toBeUndefined();
  });
});
