import saniztize from 'sanitize-html';

const config = {
  allowedTags: ['b', 'code', 'a'],
  allowedAttributes: {
    a: ['href'],
  },
};

export function sanitizeHtml(value: unknown) {
  if (typeof value !== 'string') return;

  return saniztize(value, config);
}
