#!/usr/bin/env bash
# Builds the Tailwind CSS bundle. Invoked from the CNSPlus.Web MSBuild target
# and runnable manually.
#
# Tailwind v4 requires Node 20+. Locally we use nvm + tailwind/.nvmrc to
# pick the right version; CI is expected to set up Node externally.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT/tailwind"

if [[ -z "${CI:-}" ]] && [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1091
  source "$HOME/.nvm/nvm.sh"
  nvm use --silent >/dev/null 2>&1 || nvm install --silent
fi

if [[ ! -d node_modules ]]; then
  npm install
fi

npm run build
