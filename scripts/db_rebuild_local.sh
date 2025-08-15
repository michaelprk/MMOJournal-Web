#!/usr/bin/env bash
set -euo pipefail

# MMOJournal - Rebuild schema by applying all migrations in order

DEFAULT_URL="postgresql://postgres:postgres@127.0.0.1:5433/mmojournal"
URL="${1:-$DEFAULT_URL}"
MIGRATIONS_DIR="backend/migrations"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 MMOJournal Schema Rebuild${NC}"
echo -e "📍 Target: ${URL}"
echo -e "📁 Migrations: ${MIGRATIONS_DIR}"
echo

# Check if psql exists
if ! command -v psql &> /dev/null; then
  echo -e "${RED}❌ psql not found. Please install PostgreSQL client tools.${NC}"
  exit 1
fi

# Check if migrations directory exists
if [ ! -d "${MIGRATIONS_DIR}" ]; then
  echo -e "${RED}❌ Migrations directory not found: ${MIGRATIONS_DIR}${NC}"
  exit 1
fi

# Test connection
echo -e "${YELLOW}🔌 Testing database connection...${NC}"
if ! psql "${URL}" -c "SELECT 1;" > /dev/null 2>&1; then
  echo -e "${RED}❌ Failed to connect to database. Is the container running?${NC}"
  echo -e "   Try: scripts/db_start_docker.sh"
  exit 1
fi
echo -e "${GREEN}✅ Database connection successful${NC}"
echo

# Find all .sql files in migrations directory
mapfile -t sql_files < <(find "${MIGRATIONS_DIR}" -name "*.sql" -type f | sort)

if [ ${#sql_files[@]} -eq 0 ]; then
  echo -e "${YELLOW}⚠️  No SQL migration files found in ${MIGRATIONS_DIR}${NC}"
  exit 0
fi

echo -e "${BLUE}📋 Found ${#sql_files[@]} migration file(s):${NC}"
for file in "${sql_files[@]}"; do
  echo -e "   📄 $(basename "$file")"
done
echo

# Apply each migration
for file in "${sql_files[@]}"; do
  filename=$(basename "$file")
  echo -e "${YELLOW}🔄 Applying: ${filename}${NC}"
  
  if psql "${URL}" -v ON_ERROR_STOP=1 -f "$file"; then
    echo -e "${GREEN}✅ Success: ${filename}${NC}"
  else
    echo -e "${RED}❌ Failed: ${filename}${NC}"
    echo -e "${RED}   Migration failed. Stopping here.${NC}"
    exit 1
  fi
  echo
done

echo -e "${GREEN}🎉 All migrations applied successfully!${NC}"
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "   • Verify schema: psql \"${URL}\" -c \"\\dt\""
echo -e "   • Check RLS: psql \"${URL}\" -c \"SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';\""
