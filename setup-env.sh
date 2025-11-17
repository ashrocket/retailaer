#!/bin/bash

# GitHub OAuth and Environment Variables Setup Script
# This script helps you add environment variables to Cloudflare Pages

set -e

echo "==================================="
echo "Retailaer GitHub OAuth Setup"
echo "==================================="
echo ""
echo "This script will help you add environment variables to Cloudflare Pages."
echo "You'll need:"
echo "  1. GitHub OAuth App Client ID and Secret"
echo "  2. GitHub Personal Access Token (with 'repo' scope)"
echo "  3. (Optional) Cloudflare API Token"
echo ""
echo "See SETUP-GITHUB-OAUTH.md for detailed instructions on obtaining these."
echo ""

read -p "Have you created the GitHub OAuth App? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please create the GitHub OAuth App first:"
    echo "  https://github.com/settings/developers"
    echo ""
    echo "Configuration:"
    echo "  - Homepage URL: https://retailaer.us"
    echo "  - Callback URL: https://retailaer.us/api/auth/github/callback"
    echo ""
    exit 1
fi

echo ""
echo "=== Adding Environment Variables ==="
echo ""

# GitHub Client ID
echo "1/5: GitHub OAuth Client ID"
echo "    (Find at: https://github.com/settings/developers)"
wrangler pages secret put GITHUB_CLIENT_ID --project-name retailaer

echo ""
echo "2/5: GitHub OAuth Client Secret"
echo "    (Generate at: https://github.com/settings/developers)"
wrangler pages secret put GITHUB_CLIENT_SECRET --project-name retailaer

echo ""
echo "3/5: GitHub Personal Access Token"
echo "    (Create at: https://github.com/settings/tokens/new)"
echo "    (Required scope: 'repo')"
wrangler pages secret put GITHUB_TOKEN --project-name retailaer

echo ""
echo "4/5: Cloudflare Account ID (optional - for deployment status)"
read -p "Add Cloudflare Account ID? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "ce40c57a207aaaa76ae172d63447828d" | wrangler pages secret put CLOUDFLARE_ACCOUNT_ID --project-name retailaer
    echo "✓ Added: ce40c57a207aaaa76ae172d63447828d"
else
    echo "Skipped (deployment status won't be available)"
fi

echo ""
echo "5/5: Cloudflare API Token (optional - for deployment status)"
read -p "Add Cloudflare API Token? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "    (Create at: https://dash.cloudflare.com/profile/api-tokens)"
    wrangler pages secret put CLOUDFLARE_API_TOKEN --project-name retailaer
else
    echo "Skipped (deployment status won't be available)"
fi

echo ""
echo "==================================="
echo "✓ Environment Variables Configured"
echo "==================================="
echo ""
echo "The variables are now set in Cloudflare Pages."
echo "They will be available on the next deployment."
echo ""
echo "Test the setup:"
echo "  1. Visit: https://retailaer.us"
echo "  2. Login with GitHub when prompted"
echo "  3. Click 'Edit Page' to test inline editing"
echo ""
echo "See SETUP-GITHUB-OAUTH.md for more details."
echo ""
