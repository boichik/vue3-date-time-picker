import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './index';

describe('sanitizeHtml', () => {
  describe('Positive cases (Sanitization)', () => {
    it.each([
      ['<b>Bold text</b>', '<b>Bold text</b>'],
      [
        '<div>Text with <code>code</code></div>',
        '<div>Text with <code>code</code></div>',
      ],
      [
        '<ul><li>Item 1</li><li>Item 2</li></ul>',
        '<ul><li>Item 1</li><li>Item 2</li></ul>',
      ],
      [
        '<a href="https://google.com">Link</a>',
        '<a href="https://google.com">Link</a>',
      ],
      [
        '<div class="container">Content</div>',
        '<div class="container">Content</div>',
      ],
    ])('should allow valid HTML: %s', (input, expected) => {
      expect(sanitizeHtml(input)).toBe(expected);
    });

    it.each([
      ['<script>alert("xss")</script><p>Hello</p>', 'Hello'],
      ['<img src="x" onerror="alert(1)">', ''],
      ['<div style="color: red" onclick="run()">Text</div>', '<div>Text</div>'],
      [
        '<a href="https://test.com" title="tooltip" target="_blank">Link</a>',
        '<a href="https://test.com">Link</a>',
      ],
      ['<iframe></iframe><span>Text</span>', 'Text'],
    ])('should strip disallowed tags and attributes: %s', (input, expected) => {
      expect(sanitizeHtml(input)).toBe(expected);
    });
  });

  describe('Negative cases (Input validation)', () => {
    it.each([[undefined], [null], [123], [true], [{ html: '<b></b>' }], [[]]])(
      'should return undefined for non-string input: %s',
      input => {
        expect(sanitizeHtml(input)).toBeUndefined();
      }
    );
  });
});
