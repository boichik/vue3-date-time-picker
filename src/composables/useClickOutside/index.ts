import { useEventListenerOutside } from '@/composables/useEventListenerOutside';
import type {
  EventListenerOutsideTarget,
  EventListenerOutsideCallback,
} from '@/composables/useEventListenerOutside/types';

export function useClickOutside(
  target: EventListenerOutsideTarget,
  cb: EventListenerOutsideCallback
) {
  return useEventListenerOutside(target, document, 'click', cb);
}
