#!/usr/bin/env bash
# Dumps the exercise catalog, the equipment and the legal documents that the screenshot script
# serves in place of Supabase, from a database with the app's migrations applied.
# Usage: ./catalog.sh [database url] (default: the local Supabase of `npm run supabase:start`)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
DB="${1:-postgresql://postgres:postgres@127.0.0.1:55322/postgres}"
mkdir -p "$HERE/.work/mock"

for table in exercises equipment legal_documents; do
  psql "$DB" -qAt -c "select coalesce(json_agg(t order by id), '[]') from public.$table t" \
    > "$HERE/.work/mock/$table.json"
  echo "$table: $(node -p "require('$HERE/.work/mock/$table.json').length") rows"
done
