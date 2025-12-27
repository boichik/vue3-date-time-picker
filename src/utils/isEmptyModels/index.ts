export function isEmptyModels(startModel: unknown, endModel: unknown) {
  if (!startModel && !endModel) return true;

  if (
    Array.isArray(startModel) &&
    !startModel.filter(el => Boolean(el)).length &&
    Array.isArray(endModel) &&
    !endModel.filter(el => Boolean(el)).length
  )
    return true;

  return false;
}
