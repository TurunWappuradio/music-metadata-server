const fetch = require('node-fetch');

const testPost = async () => {
  const body = JSON.stringify({
    song: 'ANSSI - 1972',
    password: '12345'
  });

  const res = await fetch('http://localhost:3031/newsong', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      "Content-Type": "application/json",
    },
    body
  });

  if (!res.ok) {
    return console.log(`post failed with status ${res.status}`);
  }
  console.log('post succesful.');
};

testPost();
