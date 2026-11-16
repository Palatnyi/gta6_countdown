'use strict';

/**
 * Момент релізу GTA 6 в Україні.
 *
 * Дата офіційна: 19 листопада 2026. Rockstar не публікує точної години розблокування,
 * але для цифрових копій (PS Store / Xbox) релізи зазвичай стартують опівночі за
 * місцевим часом. Тому за замовчуванням — 00:00 19.11.2026 за Києвом.
 * У листопаді Київ живе за UTC+2 (зимовий час), тому зміщення +02:00.
 *
 * Можна змінити без правки коду через змінну середовища RELEASE_AT (ISO 8601 з зсувом).
 */
const DEFAULT_RELEASE_AT = '2026-11-19T00:00:00+02:00';

function getReleaseDate(env = process.env) {
  const date = new Date(env.RELEASE_AT || DEFAULT_RELEASE_AT);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Некоректне значення RELEASE_AT: "${env.RELEASE_AT}"`);
  }
  return date;
}

/** Українська множина: one (1 день), few (2-4 дні), many (5+ днів). */
function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Розкладає різницю в мс на дні/години/хвилини/секунди. */
function splitDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalHours: Math.floor(totalSeconds / 3600),
  };
}

function formatCountdown(releaseDate, now = new Date()) {
  const diff = releaseDate.getTime() - now.getTime();

  if (diff <= 0) {
    return '🎮 GTA 6 уже вийшла в Україні! Ласкаво просимо до Вайс-Сіті! 🌴';
  }

  const { days, hours, minutes, seconds, totalHours } = splitDuration(diff);

  return [
    '🎮 До релізу GTA 6 в Україні залишилось:',
    '',
    `📅 ${days} ${plural(days, 'день', 'дні', 'днів')}`,
    `⏰ ${hours} ${plural(hours, 'година', 'години', 'годин')}`,
    `⏱ ${minutes} ${plural(minutes, 'хвилина', 'хвилини', 'хвилин')}`,
    `⏳ ${seconds} ${plural(seconds, 'секунда', 'секунди', 'секунд')}`,
    '',
    `Усього: ${totalHours} ${plural(totalHours, 'година', 'години', 'годин')}`,
  ].join('\n');
}

module.exports = { DEFAULT_RELEASE_AT, getReleaseDate, plural, splitDuration, formatCountdown };
