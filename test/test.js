const {toggleSummary, isBlockLevelDetail, setTitle, findDetailFor, toggleSummaryAnimation, findDetailForBlockLevel, findDetailForNonBlockLevel, getSummaries, setupSummary, } = require('../src/stretchtext.js');

describe('isBlockLevelDetail', () => {
  test('should return true for an "a" element', () => {
    const summary = document.createElement('a');
    console.log(isBlockLevelDetail);
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

describe('toggleSummaryAnimation', () => {
  test('should toggle the animation of the summary and detail elements', () => {
    const summary = document.createElement('summary');
    const detail = document.createElement('div');
    toggleSummaryAnimation(summary, detail);
    expect(summary.classList.contains('stretchtext-open')).toBe(true);
    expect(detail.classList.contains('stretchtext-open')).toBe(true);
  });
});

describe('findDetailForBlockLevel', () => {
  test('should find the detail element for the given block level summary element', () => {
    const summary = document.createElement('a');
    summary.setAttribute('href', '#detail');
    const detail = document.createElement('div');
    detail.setAttribute('id', 'detail');
    document.body.appendChild(detail);
    expect(findDetailForBlockLevel(summary)).toBe(detail);
    document.body.removeChild(detail);
  });
});

describe('findDetailForNonBlockLevel', () => {
  test('should find the detail element for the given non-block level summary element', () => {
    const parent = document.createElement('div');
    const summary = document.createElement('summary');
    const detail = document.createElement('div');
    parent.appendChild(summary)
    parent.appendChild(detail);
    expect(findDetailForNonBlockLevel(summary)).toBe(detail);
  });
});

describe('getSummaries', () => {
  test('should retrieve all summary elements in the document', () => {
    const summary1 = document.createElement('summary');
    const summary2 = document.createElement('summary');
    summary1.setAttribute('epub-type', 'stretchsummary');
    summary2.className = 'stretchsummary';
    document.body.appendChild(summary1);
    document.body.appendChild(summary2);
    expect(getSummaries()).toEqual([summary1, summary2]);
    document.body.removeChild(summary1);
    document.body.removeChild(summary2);
  });
});

describe('setupSummary', () => {
  test('should setup the given summary element', () => {
    const summary = document.createElement('summary');
    setupSummary(summary);
    expect(summary.getAttribute('title')).toBe('Expand');
    expect(summary.mousedown).not.toBe(null);
    expect(summary.touchstart).not.toBe(null);
  });
});

describe('toggleSummary', () => {
  test('should toggle the animation or something idk', () => {
    const summary = document.createElement('span');
    const detail = document.createElement('span');
    summary.className = 'stretchsummary';
    detail.className = 'stretchdetail';
    const dumb_event = new Event('submit', {'detail': 'mydetail', cancelable: true});
    dumb_event.target = summary;
    dumb_event.preventDefault = () => {};
    toggleSummary(dumb_event);
  });
});