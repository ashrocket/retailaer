#!/bin/bash
# Switch retailaer.us production branch between main (new site) and legacy (old site)
#
# Usage:
#   ./scripts/switch-branch.sh legacy   # Switch to old site
#   ./scripts/switch-branch.sh main     # Switch to new site
#   ./scripts/switch-branch.sh          # Show current branch

ACCOUNT_ID="ce40c57a207aaaa76ae172d63447828d"
PROJECT_NAME="retailaer"

# Get OAuth token from wrangler config
TOKEN=$(grep oauth_token ~/Library/Preferences/.wrangler/config/default.toml 2>/dev/null | cut -d'"' -f2)

if [ -z "$TOKEN" ]; then
  echo "Error: Could not find wrangler OAuth token. Run 'wrangler login' first."
  exit 1
fi

if [ -z "$1" ]; then
  # Show current branch
  RESULT=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
    -H "Authorization: Bearer $TOKEN")
  BRANCH=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['production_branch'])")
  echo "Current production branch: $BRANCH"
  echo ""
  echo "Usage: $0 [main|legacy]"
  exit 0
fi

BRANCH="$1"

if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "legacy" ]; then
  echo "Error: Branch must be 'main' or 'legacy'"
  exit 1
fi

echo "Switching retailaer.us to branch: $BRANCH"

RESULT=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"production_branch\": \"$BRANCH\"}")

SUCCESS=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))")

if [ "$SUCCESS" = "True" ]; then
  echo "✓ Successfully switched to '$BRANCH'"
  echo ""
  if [ "$BRANCH" = "legacy" ]; then
    echo "retailaer.us will now serve the OLD site (mirrored from retailaer.com)"
  else
    echo "retailaer.us will now serve the NEW Astro site"
  fi
  echo ""
  echo "Note: May take 1-2 minutes for changes to propagate"
else
  echo "Error: Failed to switch branch"
  echo "$RESULT"
  exit 1
fi
