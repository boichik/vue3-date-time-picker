import {
  useEventListenerOutside,
  type EventListenerOutsideCallback,
  type EventListenerOutsideTarget,
} from './useEventListenerOutside';

export function useFocusInOutside(
  target: EventListenerOutsideTarget,
  cb: EventListenerOutsideCallback
) {
  return useEventListenerOutside(target, window, 'focusin', cb);
}
