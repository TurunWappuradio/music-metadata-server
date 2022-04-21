const fetch = require("node-fetch");

const botId = process.env.BOT_ID;
const chatId = process.env.CHAT_ID;

function sendTelegramMessage(message) {
  console.log("Telegram");
  return fetch(
    `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=html`,
    {
      method: "POST"
    }
  )
    .then(response => response.json())
    .catch(console.error);
}

function sendToStream(song) {
  console.log("Stream");
  const sinkUser = process.env.SINK_USER;
  const sinkPw = process.env.SINK_PW;
  const sinkIP = process.env.SINK_IP;
  return fetch(
    `http://${sinkUser}:${sinkPw}@${sinkIP}:8000/admin/metadata?mode=updinfo&song=${encodeURIComponent(
      song
    )}&mount=/live.mp3`,
    {
      method: "GET"
    }
  )
    .catch(console.error)
    .then(console.log);
}

function dispatchMetaInformation(song) {
  console.log("Dispatching", song, botId, chatId);
  if (!song || !botId || !chatId) {
    return;
  }

  if (/turun wappuradio/.test(song.toLowerCase())) {
    return;
  }

  return Promise.all([
    sendTelegramMessage(`Biisi: <b>${song}</b>`),
    //sendToStream(song)
  ]).then(() => console.log("Succesfull delivery"));
}

module.exports = {
  dispatchMetaInformation
};
