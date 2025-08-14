### MMOJournal – Local Database Rebuild

Quick schema rebuild for testing migrations on a clean Postgres instance.

### When to use this

- **Option A (Supabase Local)**: Use when migrations contain `auth.uid()` or other Supabase-specific functions
- **Option B (Plain Postgres - this guide)**: Use for basic schema testing without Supabase auth functions

If you see errors like `function auth.uid() does not exist`, switch to Option A (Supabase Local).

### Prerequisites

- Docker installed and running
- PostgreSQL client tools (`psql` command available)

### macOS/Linux Usage

```bash
# Start container
scripts/db_start_docker.sh

# Apply all migrations
scripts/db_rebuild_local.sh

# Verify tables/columns (see below)
psql "postgresql://postgres:postgres@127.0.0.1:5433/mmojournal" -c "\dt"

# Stop container when done
scripts/db_stop_docker.sh
```

**Using npm scripts:**
```bash
npm run db:docker:start
npm run db:rebuild
# verify...
npm run db:docker:stop
```

### Windows PowerShell Usage

```powershell
# Start container
.\scripts\db_start_docker.ps1

# Apply all migrations
.\scripts\db_rebuild_local.ps1

# Verify tables/columns (see below)
psql "postgresql://postgres:postgres@127.0.0.1:5433/mmojournal" -c "\dt"

# Stop container when done
.\scripts\db_stop_docker.ps1
```

### Custom Database URL

```bash
# Bash
scripts/db_rebuild_local.sh "postgresql://user:pass@host:port/db"

# PowerShell
.\scripts\db_rebuild_local.ps1 -Url "postgresql://user:pass@host:port/db"
```

### Verification SQL

Connect to verify the schema:
```bash
psql "postgresql://postgres:postgres@127.0.0.1:5433/mmojournal"
```

**List all public tables:**
```sql
\dt public.*
```

**Check specific columns exist:**
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'shiny_hunts' 
  AND column_name IN ('is_secret_shiny', 'is_alpha')
ORDER BY column_name;
```

**Check RLS enabled and list policies:**
```sql
-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all policies (will be empty in plain Postgres)
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Note:** Plain Postgres won't have `auth.uid()` function or Supabase Auth policies. If your migrations reference these, the rebuild will fail – switch to Supabase Local instead.

### Troubleshooting

**Port 5433 already in use:**
```bash
# Check what's using the port
lsof -i :5433  # macOS/Linux
netstat -ano | findstr :5433  # Windows

# Kill existing container if it's ours
scripts/db_stop_docker.sh
```

**Container already exists:**
- Scripts handle this automatically – existing containers are restarted

**psql command not found:**
```bash
# Install PostgreSQL client tools
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client
# Windows: Download from postgresql.org
```

**auth.uid() errors:**
```
ERROR:  function auth.uid() does not exist
```
Switch to Supabase Local development instead – this is expected for Supabase-specific functions.

**Docker not running:**
```bash
# Start Docker Desktop or daemon
sudo systemctl start docker  # Linux
```

### Container Details

- **Name:** `mmoj-db`
- **Port:** `5433` (host) → `5432` (container)
- **Database:** `mmojournal`
- **User:** `postgres`
- **Password:** `postgres`
- **Image:** `postgres:15`

Data is **not persisted** – container removal deletes all data. This is intentional for clean testing.
