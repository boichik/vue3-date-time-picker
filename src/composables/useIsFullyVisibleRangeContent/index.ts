import { onMounted, onBeforeUnmount, type ShallowRef, ref } from 'vue';

export function useIsFullyVisibleRangeContent(
  element: Readonly<ShallowRef<HTMLElement | null>>
) {
  const isFullyVisible = ref(false);

  const checkResponsive = () => {
    if (!element.value) return;

    const sectionWidth = element.value.offsetWidth;

    if (sectionWidth === 0) return;

    const gap = 10;
    const padding = 30;
    const requiredWidth = sectionWidth * 2 + gap + padding;

    isFullyVisible.value = window.innerWidth > requiredWidth;
  };

  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    checkResponsive();
    resizeObserver = new ResizeObserver(() => {
      checkResponsive();
    });
    resizeObserver.observe(document.body);
  });

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  return {
    isFullyVisible,
  };
}
