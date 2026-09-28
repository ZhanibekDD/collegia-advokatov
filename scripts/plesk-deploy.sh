#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
npm ci
npm run build:plesk
mkdir -p tmp
touch tmp/restart.txt
