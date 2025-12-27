export function isEmptyModels(startModel: unknown, endModel: unknown) {
  if (!startModel && !endModel) return true;

  if (
    Array.isArray(startModel) &&
    !startModel.filter(Boolean).length &&
    Array.isArray(endModel) &&
    !endModel.filter(Boolean).length
  )
    return true;

  return false;
}
