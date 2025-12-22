export function enabledDateTimeTypeByTemplate(template: string) {
  let value = '';

  if (typeof template === 'string') {
    value = template;
  }

  return {
    years: value.includes('Y') || value.includes('y'),
    months: value.includes('M'),
    days: value.includes('D') || value.includes('d'),
    hours: value.includes('HH') || value.includes('hh'),
    minutes: value.includes('mm'),
    seconds: value.includes('ss'),
    amPm: value.includes('a'),
  };
}
