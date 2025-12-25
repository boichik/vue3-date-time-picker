export function isEmptyModels(startModel: unknown, endModel: unknown) {
  if (!startModel && !endModel) return true;

  if (
    Array.isArray(startModel) &&
    !startModel.filter(el => !!el).length &&
    Array.isArray(endModel) &&
    !endModel.filter(el => !!el).length
  )
    return true;

  return false;
}
