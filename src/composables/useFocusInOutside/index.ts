import { useEventListenerOutside } from '@/composables/useEventListenerOutside';
import type {
  EventListenerOutsideTarget,
  EventListenerOutsideCallback,
} from '@/composables/useEventListenerOutside/types';

export function useFocusInOutside(
  target: EventListenerOutsideTarget,
  cb: EventListenerOutsideCallback
) {
  return useEventListenerOutside(target, window, 'focusin', cb);
}
