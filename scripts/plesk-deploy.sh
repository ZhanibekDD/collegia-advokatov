#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# The shared hosting plan kills npm during dependency installation because of
# its memory limit. The application is built on the development machine and
# committed as a compressed standalone bundle instead.
BUNDLE="deploy/plesk-bundle.tar.gz"
if [[ ! -f "$BUNDLE" ]]; then
  echo "Prebuilt Plesk bundle was not found: $BUNDLE" >&2
  exit 1
fi

rm -rf dist
tar -xzf "$BUNDLE"

if [[ ! -f "dist/standalone/server.js" ]]; then
  echo "The Plesk bundle does not contain dist/standalone/server.js" >&2
  exit 1
fi

mkdir -p tmp
touch tmp/restart.txt
