import type { Ref } from 'vue';

export type InternalTarget = HTMLElement | Node | null;

export type EventListenerOutsideTarget =
  | Ref<InternalTarget>
  | Ref<InternalTarget>[];

export type EventListenerOutsideCallback = (
  isOutside: boolean,
  event: Event
) => void;
