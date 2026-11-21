#!/usr/bin/env bash
# Runs the migrations + tests against a throwaway local Postgres.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
db="ib_test_$$"
createdb "$db"
trap 'dropdb "$db"' EXIT
psql -q -v ON_ERROR_STOP=1 -d "$db" -f "$here/supabase_stub.sql"
for f in "$here"/../migrations/*.sql; do psql -q -v ON_ERROR_STOP=1 -d "$db" -f "$f"; done
psql -v ON_ERROR_STOP=1 -d "$db" -f "$here/identity_test.sql"
