import {
  useEventListenerOutside,
  type EventListenerOutsideCallback,
  type EventListenerOutsideTarget,
} from './useEventListenerOutside';

export function useClickOutside(
  target: EventListenerOutsideTarget,
  cb: EventListenerOutsideCallback
) {
  return useEventListenerOutside(target, document, 'click', cb);
}
