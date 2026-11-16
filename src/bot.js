'use strict';

require('dotenv').config();
const path = require('node:path');
const { Telegraf } = require('telegraf');
const { getReleaseDate, formatCountdown } = require('./countdown');
const { createUserCounter } = require('./user-counter');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Помилка: задайте BOT_TOKEN у файлі .env (див. .env.example)');
  process.exit(1);
}

const adminToken = process.env.ADMIN_BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;
if (!adminToken || !adminChatId) {
  console.error('Помилка: задайте ADMIN_BOT_TOKEN і ADMIN_CHAT_ID у файлі .env');
  process.exit(1);
}

const releaseDate = getReleaseDate();
const bot = new Telegraf(token);
const adminBot = new Telegraf(adminToken);
const userCounter = createUserCounter(path.join(__dirname, '../data/users.json'));

bot.use(async (ctx, next) => {
  if (ctx.chat?.type === 'private' && ctx.from) {
    const { count, isNew } = userCounter.record(ctx.from.id);
    if (isNew) {
      const username = ctx.from.username ? `@${ctx.from.username}` : `відсутній (ID ${ctx.from.id})`;
      const date = new Intl.DateTimeFormat('uk-UA', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'Europe/Kyiv',
      }).format(new Date());

      try {
        await adminBot.telegram.sendMessage(
          adminChatId,
          `Новий користувач бота!\nЮзернейм: ${username}\nДата: ${date}\nУнікальний користувач №${count}`,
        );
      } catch (err) {
        console.error('Не вдалося надіслати сповіщення про нового користувача:', err.message);
      }

      console.log(`Унікальних користувачів бота: ${count}`);
    }
  }
  return next();
});

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
    console.log(`Унікальних користувачів бота: ${userCounter.getCount()}`);
  })
  .catch((err) => {
    console.error('Не вдалося запустити бота:', err.message);
    process.exit(1);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
