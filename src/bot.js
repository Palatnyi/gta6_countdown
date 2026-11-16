'use strict';

require('dotenv').config();
const { Telegraf } = require('telegraf');
const { getReleaseDate, formatCountdown } = require('./countdown');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Помилка: задайте BOT_TOKEN у файлі .env (див. .env.example)');
  process.exit(1);
}

const releaseDate = getReleaseDate();
const bot = new Telegraf(token);

// Єдина команда бота. /start відповідає так само, щоб перше відкриття бота теж працювало.
const reply = (ctx) => ctx.reply(formatCountdown(releaseDate));
bot.command('gta', reply);
bot.start(reply);

bot.catch((err) => console.error('Помилка бота:', err));

bot
  .launch(async () => {
    await bot.telegram.setMyCommands([
      { command: 'gta', description: 'Коли релізнуть GTA 6?!' },
    ]);
    console.log(`Бот запущено. Реліз: ${releaseDate.toISOString()}`);
  })
  .catch((err) => {
    console.error('Не вдалося запустити бота:', err.message);
    process.exit(1);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
