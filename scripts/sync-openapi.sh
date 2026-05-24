#!/usr/bin/env bash
# Copies the OpenAPI spec from a sibling CNSPlus.Api checkout into this repo.
# Run this after API changes; commit the resulting diff to openapi/openapi.json.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="${1:-$REPO_ROOT/../CNSPlus.Api/openapi.json}"
DEST="$REPO_ROOT/openapi/openapi.json"

if [[ ! -f "$SOURCE" ]]; then
  echo "error: openapi spec not found at $SOURCE" >&2
  echo "usage: $0 [path-to-openapi.json]" >&2
  exit 1
fi

cp "$SOURCE" "$DEST"
echo "copied $SOURCE -> $DEST"
