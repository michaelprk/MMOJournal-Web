# Pokemon Build API

A simple Express.js backend for managing Pokemon builds with Prisma ORM and SQLite database.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

The server will start on `http://localhost:4000`

## 📋 API Endpoints

### Health Check
- **GET** `/health` - Server health check

### Pokemon Builds CRUD

#### Get all Pokemon builds
```http
GET /api/pokemon
```

#### Get Pokemon build by ID
```http
GET /api/pokemon/:id
```

#### Create new Pokemon build
```http
POST /api/pokemon
Content-Type: application/json

{
  "name": "Pikachu",
  "tier": "OU",
  "moves": ["Thunderbolt", "Quick Attack", "Thunder Wave", "Substitute"],
  "item": "Light Ball",
  "nature": "Timid",
  "ability": "Static",
  "description": "A fast electric attacker"
}
```

#### Update Pokemon build
```http
PATCH /api/pokemon/:id
Content-Type: application/json

{
  "name": "Updated Pikachu",
  "tier": "UU",
  "moves": ["Thunder", "Volt Switch", "Hidden Power Ice", "Substitute"]
}
```

#### Delete Pokemon build
```http
DELETE /api/pokemon/:id
```

### PokeAPI Proxy

#### Get Pokemon data from PokeAPI
```http
GET /api/pokeapi/pokemon/:name
```

Returns simplified Pokemon data including:
- Basic info (id, name, height, weight)
- Types
- Abilities
- Base stats
- Sprite image URL

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Test all endpoints
node test-api.js

# Test CRUD operations
node test-create-pokemon.js
```

## 📊 Database Schema

The `PokemonBuild` model includes:
- `id` - Auto-incrementing primary key
- `name` - Pokemon name
- `tier` - Competitive tier (OU, UU, etc.)
- `moves` - JSON array of move names
- `item` - Held item
- `nature` - Pokemon nature
- `ability` - Pokemon ability
- `description` - Build description
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **External API**: PokeAPI integration
- **Dependencies**: cors, node-fetch@2

## 🎯 Features

- ✅ Full CRUD operations for Pokemon builds
- ✅ PokeAPI proxy integration
- ✅ Error handling and logging
- ✅ CORS enabled
- ✅ JSON parsing for moves array
- ✅ Comprehensive test coverage

## 📝 Example Usage

```javascript
// Create a new Pokemon build
const newBuild = {
  name: "Garchomp",
  tier: "OU",
  moves: ["Earthquake", "Dragon Claw", "Stone Edge", "Swords Dance"],
  item: "Life Orb",
  nature: "Jolly",
  ability: "Rough Skin",
  description: "Physical sweeper build"
};

fetch('http://localhost:4000/api/pokemon', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newBuild)
});
```

## 🐛 Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

All errors include descriptive error messages in the response body. 