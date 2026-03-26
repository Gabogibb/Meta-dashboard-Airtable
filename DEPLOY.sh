#!/bin/bash

# Analytics Dashboard Deployment Script
# This script pushes your code to GitHub and provides Vercel deployment instructions

set -e

echo "🚀 Analytics Dashboard Deployment"
echo "=================================="
echo ""

# Step 1: Verify git status
echo "Step 1: Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
    echo "✓ Working directory clean"
else
    echo "⚠ Warning: You have uncommitted changes"
    git status
    echo ""
fi

# Step 2: Push to GitHub
echo ""
echo "Step 2: Pushing to GitHub..."
echo "Repository: gabogibb/openclaud"
echo "Branch: claude/airtable-dashboard-vercel-nna37"
echo ""

read -p "Do you want to push now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin claude/airtable-dashboard-vercel-nna37
    echo "✓ Successfully pushed to GitHub!"
else
    echo "Skipped GitHub push"
fi

echo ""
echo "=================================="
echo "✅ Ready for Vercel Deployment!"
echo "=================================="
echo ""
echo "Next Steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Click 'Import Git Repository'"
echo "3. Paste: https://github.com/gabogibb/openclaud.git"
echo "4. Select branch: claude/airtable-dashboard-vercel-nna37"
echo "5. Click 'Import'"
echo ""
echo "Environment Variables to Add:"
echo "  AIRTABLE_API_KEY = <your_airtable_token>"
echo "  AIRTABLE_BASE_ID = appQHdlwIGlr1Asye"
echo "  GOOGLE_SHEETS_ID = 17S5kCMPvlHr9ZJoh0G5pvyYqrdXZSH5X8yvbqkQKPG0"
echo "  GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON = <optional>"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
