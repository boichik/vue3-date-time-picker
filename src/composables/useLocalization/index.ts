import { useI18n } from 'vue-i18n';

export function useLocalization() {
  try {
    return useI18n({ useScope: 'global' });
  } catch {
    return undefined;
  }
}
