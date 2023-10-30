const { toggleSummary, isBlockLevelDetail, setTitle, findDetailFor } = require('../src/stretchtext');

describe('isBlockLevelDetail', () => {
  test('should return true for an "a" element', () => {
    const summary = document.createElement('a');
    expect(isBlockLevelDetail(summary)).toBe(true);
  });

  test('should return false for a "summary" element', () => {
    const summary = document.createElement('summary');
    expect(isBlockLevelDetail(summary)).toBe(false);
  });
});

describe('setTitle', () => {
  test('should set the title attribute of the summary element', () => {
    const summary = document.createElement('summary');
    setTitle(summary, 'Expand');
    expect(summary.getAttribute('title')).toBe('Expand');
  });

  test('should not overwrite an existing title attribute', () => {
    const summary = document.createElement('summary');
    summary.setAttribute('title', 'Custom Title');
    setTitle(summary, 'Expand');
    expect(summary.getAttribute('title')).toBe('Custom Title');
  });
});

describe('findDetailFor', () => {
  test('should find the detail element for an "a" element', () => {
    const summary = document.createElement('a');
    summary.setAttribute('href', '#detail');
    const detail = document.createElement('div');
    detail.setAttribute('id', 'detail');
    document.body.appendChild(detail);
    expect(findDetailFor(summary)).toBe(detail);
    document.body.removeChild(detail);
  });

  test('should find the next sibling element for a "summary" element', () => {
    const parent = document.createElement('div');
    const summary = document.createElement('summary');
    const detail = document.createElement('div');
    parent.appendChild(summary)
    parent.appendChild(detail);
    expect(findDetailFor(summary)).toBe(detail);
  });
});