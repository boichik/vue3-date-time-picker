import { useData } from 'vitepress';

export function useLocalization() {
  const { theme } = useData();

  return {
    t: (value: unknown) => {
      if (typeof value !== 'string') return value;

      return theme.value.translations &&
        typeof theme.value.translations === 'object' &&
        value in theme.value.translations
        ? theme.value.translations[value]
        : value;
    },
  };
}
