'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createUserCounter } = require('../src/user-counter');

test('record рахує унікальних користувачів та зберігає їх між запусками', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'gta6-users-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, 'data', 'users.json');

  const counter = createUserCounter(filePath);
  assert.deepStrictEqual(counter.record(123), { count: 1, isNew: true });
  assert.deepStrictEqual(counter.record(123), { count: 1, isNew: false });
  assert.deepStrictEqual(createUserCounter(filePath).record(456), { count: 2, isNew: true });
});
