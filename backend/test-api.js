const http = require('http');

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          path: path
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Backend API Endpoints...\n');
  
  const endpoints = [
    '/health',
    '/api/pokemon',
    '/api/pokeapi/pokemon/pikachu'
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      console.log(`✅ ${endpoint}: ${result.statusCode}`);
      if (result.data) {
        console.log(`   Response: ${result.data.substring(0, 100)}${result.data.length > 100 ? '...' : ''}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: FAILED - ${error.message}`);
    }
    console.log('');
  }
}

runTests().catch(console.error); 