# Supabase Setup Guide

This guide will help you set up Supabase for your Pokemon Build application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New project"
3. Choose your organization and provide:
   - Project name: `pokemon-builds` (or your preferred name)
   - Database password: Create a strong password
   - Region: Choose the closest region to you
4. Click "Create new project"

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the "SQL Editor"
2. Create a new query and run this SQL to create the pokemon_builds table:

```sql
-- Create the pokemon_builds table
CREATE TABLE IF NOT EXISTS pokemon_builds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('OU', 'UU', 'RU', 'NU', 'PU', 'Ubers', 'Doubles', 'VGC', 'Other')),
  level INTEGER NOT NULL DEFAULT 50 CHECK (level >= 1 AND level <= 100),
  nature TEXT NOT NULL,
  ability TEXT NOT NULL,
  item TEXT,
  moves TEXT[] NOT NULL DEFAULT '{}',
  ivs JSONB NOT NULL DEFAULT '{
    "hp": 31,
    "attack": 31,
    "defense": 31,
    "sp_attack": 31,
    "sp_defense": 31,
    "speed": 31
  }',
  evs JSONB NOT NULL DEFAULT '{
    "hp": 0,
    "attack": 0,
    "defense": 0,
    "sp_attack": 0,
    "sp_defense": 0,
    "speed": 0
  }',
  description TEXT,
  showdown_import TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_pokemon_builds_tier ON pokemon_builds(tier);
CREATE INDEX IF NOT EXISTS idx_pokemon_builds_user_id ON pokemon_builds(user_id);
CREATE INDEX IF NOT EXISTS idx_pokemon_builds_created_at ON pokemon_builds(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_pokemon_builds_updated_at
  BEFORE UPDATE ON pokemon_builds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE pokemon_builds ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all pokemon builds" ON pokemon_builds
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own pokemon builds" ON pokemon_builds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pokemon builds" ON pokemon_builds
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pokemon builds" ON pokemon_builds
  FOR DELETE USING (auth.uid() = user_id);
```

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

To find these values:
- Go to your Supabase project dashboard
- Click "Settings" → "API"
- Copy the "Project URL" and "anon public" key

## Step 4: Optional - Authentication Setup

If you want user authentication (recommended for production):

1. In Supabase dashboard, go to "Authentication" → "Settings"
2. Configure your desired authentication providers
3. Update the RLS policies as needed

## Step 5: Test Your Setup

1. Run your React application: `npm run dev`
2. Navigate to the PVP page (`/pvp`)
3. Try adding a Pokemon build to test the connection

## Example Environment Variables

```env
# Replace with your actual Supabase project details
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjAwMDAwMCwiZXhwIjoxOTU3NTc2MDAwfQ.example-key-here
```

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Make sure your environment variables are correctly set and the `.env` file is in the project root.

2. **"Row Level Security policy violation"**: This happens if RLS is enabled but no policies allow the operation. Make sure the policies are created correctly.

3. **"Table doesn't exist"**: Run the SQL schema creation script in the Supabase SQL Editor.

### Debugging

1. Check the browser console for error messages
2. Check the Supabase dashboard logs under "Logs" → "Database"
3. Make sure your environment variables are loaded (check `process.env.VITE_SUPABASE_URL` in the browser console)

## Alternative: Using with Existing Backend

If you prefer to use your existing backend instead of Supabase:

1. Keep your current backend running
2. Update the `PokemonBuildService` in `app/services/supabase.ts` to use your backend endpoints
3. Remove the Supabase client import and use regular fetch calls

## Next Steps

Once your Supabase setup is complete, you can:
- Add user authentication
- Set up real-time subscriptions for live updates
- Add more advanced features like team building
- Deploy your app with automatic Supabase connection

For more detailed documentation, visit the [Supabase Documentation](https://supabase.com/docs). 