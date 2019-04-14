const fetch = require('node-fetch');

const testPost = async () => {
  const res = await fetch('http://localhost:3031/newsong', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ song: 'Anssi Kela - 1972' })
  });

  if (!res.ok) {
    return console.log(`post failed with status ${res.status}`);
  }
  console.log('post succesful.');
};

testPost();
