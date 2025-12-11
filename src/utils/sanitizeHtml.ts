import saniztize from 'sanitize-html';

const config = {
  allowedTags: ['b', 'code', 'a', 'ul', 'li', 'div'],
  allowedAttributes: {
    a: ['href'],
    div: ['class'],
  },
};

export function sanitizeHtml(value: unknown) {
  if (typeof value !== 'string') return;

  return saniztize(value, config);
}
