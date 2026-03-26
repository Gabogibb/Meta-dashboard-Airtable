# Deployment Guide

This guide will walk you through deploying the Analytics Dashboard to Vercel.

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Airtable API Key** - From [airtable.com/account/api](https://airtable.com/account/api)
4. **Google Cloud Project** - For Google Sheets API access

## Step 1: Prepare Credentials

### Airtable
1. Go to [airtable.com/account/api](https://airtable.com/account/api)
2. Copy your API token (or generate a new one)
3. Note your base ID from the URL

### Google Sheets
Choose ONE authentication method:

**Option A: Service Account (Recommended)**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create a Service Account:
   - Go to Service Accounts page
   - Click "Create Service Account"
   - Fill in name, ID, description
   - Click "Create and Continue"
   - Skip optional steps, click "Done"
5. Create a key:
   - Click on the service account email
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Select JSON format
   - Download and keep the JSON file
6. Share your Google Sheet with the service account email address
7. Convert the JSON key to a single-line string for environment variable

**Option B: OAuth2 (Alternative)**
1. Similar setup as above
2. Use OAuth2 credentials instead
3. You'll need: client_id, client_secret, refresh_token

## Step 2: Push to GitHub

```bash
# Add git remote if not already done
git remote add origin https://github.com/YOUR_USERNAME/openclaud.git

# Push the branch
git push -u origin claude/airtable-dashboard-vercel-nna37
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the interactive prompts to:
- Link to your GitHub repository
- Select your project name
- Set environment variables

### Option B: Via Vercel Web Interface

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Paste your GitHub repository URL
4. Select the repository and branch
5. Click Import
6. **Configure Project**:
   - Root Directory: `./` (default)
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
7. Click "Deploy"

## Step 4: Set Environment Variables

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add the following variables:

```
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=appQHdlwIGlr1Asye
GOOGLE_SHEETS_ID=17S5kCMPvlHr9ZJoh0G5pvyYqrdXZSH5X8yvbqkQKPG0
GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

**For GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON:**
- Copy the entire JSON from your service account key file
- Make it a single line (remove newlines)
- Paste into environment variable

Example (on one line):
```
{"type":"service_account","project_id":"my-project","private_key_id":"key123",...}
```

**Important**: Make sure to select "Production" and "Preview" environments for all variables.

## Step 5: Verify Deployment

1. After deployment completes, click "Visit" to open your dashboard
2. Navigate to the Settings tab
3. Check API Health Status - should show both services as "Connected"
4. If not connected, verify:
   - Environment variables are set correctly
   - API keys are valid
   - Google Sheet is shared with service account
   - Airtable base ID is correct

## Troubleshooting

### "API Health Status: Degraded"

**Airtable not connected:**
- Verify `AIRTABLE_API_KEY` is correct
- Verify `AIRTABLE_BASE_ID` is the correct base ID
- Check API key hasn't been revoked

**Google Sheets not connected:**
- Verify `GOOGLE_SHEETS_ID` is correct (from URL)
- For service account: Verify JSON is valid and sheet is shared
- Check that the sheet ID is correct (gid parameter in URL)

### "Failed to fetch data"

- Check Vercel function logs (Settings → Functions)
- Verify all environment variables are present
- Check API rate limits (Airtable and Google Sheets)
- Try refreshing the dashboard page

### Slow performance

- Data is cached for 5 minutes by default
- Refresh interval can be adjusted in Settings tab
- Check Vercel Analytics for performance insights

## Monitoring

After deployment:

1. **Monitor Error Rates**: Vercel Dashboard → Analytics
2. **Check Logs**: Settings → Functions → Runtime Logs
3. **Set up Alerts**: Vercel Dashboard → Settings → Integrations (optional)

## Updates & Maintenance

To deploy updates:

```bash
# Make your changes locally
git add .
git commit -m "Your changes"
git push origin claude/airtable-dashboard-vercel-nna37
```

Vercel will automatically redeploy on push to your branch.

## Cost Considerations

**Free tier is usually sufficient:**
- 1000 serverless function executions per month
- 100 GB bandwidth per month
- 50 Build minutes per month

**To optimize costs:**
- Use longer cache TTL (default: 5 minutes)
- Reduce auto-refresh frequency in Settings
- Consider Airtable API limits

## Support

For issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Airtable API Docs](https://airtable.com/api)
3. Check [Google Sheets API Docs](https://developers.google.com/sheets/api)
