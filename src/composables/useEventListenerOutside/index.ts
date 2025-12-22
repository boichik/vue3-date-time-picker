import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import type {
  EventListenerOutsideTarget,
  EventListenerOutsideCallback,
  InternalTarget,
} from './types';

export function useEventListenerOutside<T extends Document | Window>(
  target: EventListenerOutsideTarget,
  space: T,
  // eslint-disable-next-line no-undef
  eventName: T extends Document ? keyof DocumentEventMap : keyof WindowEventMap,
  cb: EventListenerOutsideCallback
) {
  const isOutside = ref(true);

  function getParentElement(element: Ref<unknown>): InternalTarget {
    if (!element.value) {
      return null;
    }

    return (
      typeof element.value === 'object' && '$el' in element.value
        ? element.value.$el
        : element.value
    ) as InternalTarget;
  }

  function containsOrEqualNode(parent: InternalTarget, child: Node): boolean {
    return (
      !!parent &&
      ((parent.isEqualNode && parent.isEqualNode(child)) ||
        (parent.contains && parent.contains(child)))
    );
  }

  function targetElementContainsInParent(element: Node) {
    if (Array.isArray(target)) {
      return target
        .map(el => containsOrEqualNode(getParentElement(el), element))
        .some(el => !!el);
    } else {
      return containsOrEqualNode(getParentElement(target), element);
    }
  }

  function handleCheckOutsideEvent(event: Event) {
    if (
      (Array.isArray(target) && !target.length) ||
      (!Array.isArray(target) && !target.value)
    )
      return;

    if (
      targetElementContainsInParent(event.target as Node) ||
      (event instanceof FocusEvent &&
        event.relatedTarget &&
        targetElementContainsInParent(event.relatedTarget as Node))
    ) {
      isOutside.value = false;
    } else {
      isOutside.value = true;
      if (cb) cb(isOutside.value, event);
    }
  }

  onMounted(() => {
    space.addEventListener(eventName, handleCheckOutsideEvent);
  });

  onUnmounted(() => {
    space.removeEventListener(eventName, handleCheckOutsideEvent);
  });
}
