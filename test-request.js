const http = require('http');

function testUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`URL: ${url}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        console.log(`Body Length: ${data.length}`);
        if (res.statusCode >= 400) {
          console.log(`Body Snippet:`, data.substring(0, 500));
        }
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error requesting ${url}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  await testUrl('http://localhost:3000/api/saved');
  await testUrl('http://localhost:3000/dashboard/saved');
}

run();
