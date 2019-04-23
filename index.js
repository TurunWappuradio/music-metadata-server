const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('express-ws');

const PORT = process.env.PORT || 3031;

let currentSong = '';
let sendToSocket = () => {};

const app = express();
const expressWs = WebSocket(app);
const wss = expressWs.getWss('/');

app.use(bodyParser.json());

app.post('/newsong', (req, res) => {
  const { song } = req.body;

  if (!song || typeof song !== 'string') {
    return res.sendStatus(400)
  }

  console.log(`Received new song: ${song}`);
  currentSong = song;
  sendToSocket(song);
  res.sendStatus(200);
});


sendToSocket = song => {
  if (song !== '') {
    wss.clients.forEach(client => {
      client.send(song);
    });
  }
};

app.ws('/', client => {
  client.on('message', message => {
    if (message !== 'PONG') {
      console.log('received: %s', message);
    }
  });

  if (currentSong !== '') {
    client.send(currentSong);
  }
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send('PING');
  });
}, 1000);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});
