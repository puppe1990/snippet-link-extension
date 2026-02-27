#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT_DIR/shared/ui-core.css"
SRC_JS="$ROOT_DIR/shared/ui-core.js"
EXT_TARGET="$ROOT_DIR/extension/ui-core.css"
WEB_TARGET="$ROOT_DIR/web/ui-core.css"
EXT_TARGET_JS="$ROOT_DIR/extension/ui-core.js"
WEB_TARGET_JS="$ROOT_DIR/web/ui-core.js"

if [[ ! -f "$SRC" ]]; then
  echo "Missing source file: $SRC" >&2
  exit 1
fi

if [[ ! -f "$SRC_JS" ]]; then
  echo "Missing source file: $SRC_JS" >&2
  exit 1
fi

cp "$SRC" "$EXT_TARGET"
cp "$SRC" "$WEB_TARGET"
cp "$SRC_JS" "$EXT_TARGET_JS"
cp "$SRC_JS" "$WEB_TARGET_JS"

echo "Synced:"
echo " - $EXT_TARGET"
echo " - $WEB_TARGET"
echo " - $EXT_TARGET_JS"
echo " - $WEB_TARGET_JS"
