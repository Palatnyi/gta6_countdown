'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { plural, splitDuration, formatCountdown, getReleaseDate } = require('../src/countdown');

test('plural: українська множина', () => {
  assert.strictEqual(plural(1, 'день', 'дні', 'днів'), 'день');
  assert.strictEqual(plural(2, 'день', 'дні', 'днів'), 'дні');
  assert.strictEqual(plural(5, 'день', 'дні', 'днів'), 'днів');
  assert.strictEqual(plural(11, 'день', 'дні', 'днів'), 'днів');
  assert.strictEqual(plural(21, 'день', 'дні', 'днів'), 'день');
  assert.strictEqual(plural(14, 'день', 'дні', 'днів'), 'днів');
  assert.strictEqual(plural(0, 'день', 'дні', 'днів'), 'днів');
});

test('splitDuration розкладає час', () => {
  const ms = ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
  assert.deepStrictEqual(splitDuration(ms), {
    days: 2, hours: 3, minutes: 4, seconds: 5, totalHours: 51,
  });
});

test('formatCountdown: до і після релізу', () => {
  const release = getReleaseDate({});
  const before = new Date(release.getTime() - 90061 * 1000); // 1д 1г 1хв 1с
  const text = formatCountdown(release, before);
  assert.match(text, /1 день/);
  assert.match(text, /1 година/);
  assert.match(text, /1 хвилина/);
  assert.match(text, /1 секунда/);
  assert.match(formatCountdown(release, release), /уже вийшла/);
});

test('getReleaseDate: за замовчуванням опівніч за Києвом (UTC+2)', () => {
  assert.strictEqual(getReleaseDate({}).toISOString(), '2026-11-18T22:00:00.000Z');
});
