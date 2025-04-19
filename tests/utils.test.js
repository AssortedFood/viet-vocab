// tests/utils.test.js
const { removeDiacritics } = require('../lib/utils');

describe('removeDiacritics()', () => {
  it('strips Vietnamese accents correctly', () => {
    expect(removeDiacritics('Đặng Thị')).toBe('Dang Thi');
  });

  it('leaves ASCII‑only strings unchanged', () => {
    expect(removeDiacritics('Hello World')).toBe('Hello World');
  });
});
