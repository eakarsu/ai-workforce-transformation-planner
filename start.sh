#!/usr/bin/env bash
# Workforce Transformation Planner — local development starter
set -euo pipefail
cd "$(dirname "$0")"

# Portfolio-level OpenRouter credentials (optional), then local overrides.
if [ -f ../.openrouter.env ]; then
  set -a; source ../.openrouter.env; set +a
fi
if [ -f .env ]; then
  set -a; source .env; set +a
fi

if [ ! -d node_modules ]; then
  npm install
fi

if [ -n "${DATABASE_URL:-}" ]; then
  if [ -z "${NEXTAUTH_SECRET:-}" ] || [ "${#NEXTAUTH_SECRET}" -lt 32 ]; then
    echo "NEXTAUTH_SECRET must be set to at least 32 characters. Copy .env.example to .env and set a real secret." >&2
    exit 1
  fi
  npx prisma migrate deploy
else
  echo "DATABASE_URL is not set. Copy .env.example to .env first." >&2
  exit 1
fi

exec npm run dev
