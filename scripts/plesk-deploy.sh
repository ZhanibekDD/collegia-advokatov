#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Git deployment actions run in a restricted shell where Plesk's Node.js
# binaries are not added to PATH automatically.
PLESK_NODE_BIN="/opt/plesk/node/22/bin"
if [[ ! -x "$PLESK_NODE_BIN/node" || ! -f "$PLESK_NODE_BIN/npm" ]]; then
  echo "Plesk Node.js 22 was not found in $PLESK_NODE_BIN" >&2
  exit 1
fi
export PATH="$PLESK_NODE_BIN:$PATH"

npm ci --scripts-prepend-node-path=true
npm run build:plesk --scripts-prepend-node-path=true
mkdir -p tmp
touch tmp/restart.txt
