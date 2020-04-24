const fetch = require("node-fetch");

const botId = process.env.BOT_ID;
const chatId = process.env.CHAT_ID;

function sendTelegramMessage(message) {
  return fetch(
    `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=html`,
    {
      method: "POST"
    }
  );
}

function dispatchMetaInformation(song) {
  if (!song || !botId || !chatId) {
    return;
  }

  if (/turun wappuradio/.test(song.toLowerCase())) {
    return;
  }

  return sendTelegramMessage(`Biisi: <b>${song}</b>`);
}

module.exports = {
  dispatchMetaInformation
};
