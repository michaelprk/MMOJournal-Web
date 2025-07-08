import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import pokemonRoutes from './pokemon/index';
import pokeApiRoutes from './pokemon/pokeapi';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/pokeapi', pokeApiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
}); 