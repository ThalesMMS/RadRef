import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLocalizedNumber, roundToNearestMillimeter } from './numbers.ts';

test('localized numbers accept decimal comma and dot', () => {
  assert.equal(parseLocalizedNumber('5,5'), 5.5);
  assert.equal(parseLocalizedNumber(' 5.5 '), 5.5);
  assert.equal(parseLocalizedNumber(''), undefined);
  assert.equal(parseLocalizedNumber('abc'), undefined);
});

test('Fleischner rounding uses nearest whole millimeter', () => {
  assert.equal(roundToNearestMillimeter(5.4), 5);
  assert.equal(roundToNearestMillimeter(5.5), 6);
  assert.equal(roundToNearestMillimeter(8.4), 8);
  assert.equal(roundToNearestMillimeter(8.5), 9);
});
