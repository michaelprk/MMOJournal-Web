const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
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
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData,
          path: path
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testPokemonCrud() {
  console.log('🧪 Testing Pokemon CRUD Operations...\n');
  
  try {
    // 1. Test creating a Pokemon build
    console.log('1. Creating a test Pokemon build...');
    const newPokemon = {
      name: 'Pikachu',
      tier: 'OU',
      moves: ['Thunderbolt', 'Quick Attack', 'Thunder Wave', 'Substitute'],
      item: 'Light Ball',
      nature: 'Timid',
      ability: 'Static',
      description: 'A fast electric attacker'
    };
    
    const createResult = await makeRequest('/api/pokemon', 'POST', newPokemon);
    console.log(`   Status: ${createResult.statusCode}`);
    if (createResult.statusCode === 201) {
      console.log('   ✅ Pokemon build created successfully!');
      const created = JSON.parse(createResult.data);
      console.log(`   Created: ${created.name} (ID: ${created.id})`);
    } else {
      console.log('   ❌ Failed to create Pokemon build');
      console.log(`   Response: ${createResult.data}`);
    }
    
    // 2. Test fetching all Pokemon builds
    console.log('\n2. Fetching all Pokemon builds...');
    const allResult = await makeRequest('/api/pokemon');
    console.log(`   Status: ${allResult.statusCode}`);
    if (allResult.statusCode === 200) {
      const builds = JSON.parse(allResult.data);
      console.log(`   ✅ Found ${builds.length} Pokemon builds`);
      if (builds.length > 0) {
        console.log(`   First build: ${builds[0].name}`);
      }
    } else {
      console.log('   ❌ Failed to fetch Pokemon builds');
    }
    
    // 3. Test PokeAPI proxy
    console.log('\n3. Testing PokeAPI proxy...');
    const pokeApiResult = await makeRequest('/api/pokeapi/pokemon/charizard');
    console.log(`   Status: ${pokeApiResult.statusCode}`);
    if (pokeApiResult.statusCode === 200) {
      const pokemon = JSON.parse(pokeApiResult.data);
      console.log(`   ✅ PokeAPI proxy working! Got data for ${pokemon.name}`);
      console.log(`   Types: ${pokemon.types.join(', ')}`);
    } else {
      console.log('   ❌ PokeAPI proxy failed');
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPokemonCrud(); 