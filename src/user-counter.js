'use strict';

const fs = require('node:fs');
const path = require('node:path');

function createUserCounter(filePath) {
  let users = new Set();

  try {
    const savedUsers = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(savedUsers) || savedUsers.some((id) => typeof id !== 'string')) {
      throw new Error('Файл лічильника користувачів має містити масив ID.');
    }
    users = new Set(savedUsers);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  return {
    record(userId) {
      if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new TypeError('ID користувача має бути додатним цілим числом.');
      }

      const id = String(userId);
      if (users.has(id)) return { count: users.size, isNew: false };

      users.add(id);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify([...users]), 'utf8');
      return { count: users.size, isNew: true };
    },
    getCount() {
      return users.size;
    },
  };
}

module.exports = { createUserCounter };
