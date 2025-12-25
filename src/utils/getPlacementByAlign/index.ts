export function getPlacementByAlign(align: unknown) {
  switch (align) {
    case 'center':
      return 'bottom';
    case 'right':
      return 'bottom-end';
    case 'left':
    default:
      return 'bottom-start';
  }
}
