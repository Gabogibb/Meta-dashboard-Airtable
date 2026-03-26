# Quick Start: Deploy Dashboard to Vercel

## TL;DR - 5 Minutes to Live Dashboard

### 1. **Get Your Credentials** (2 min)

**Airtable:**
- Go to: https://airtable.com/account/api
- Copy your API token
- Note your base ID: `appQHdlwIGlr1Asye`

**Google Sheets:**
- Go to: https://console.cloud.google.com
- Create Service Account (or use API key)
- Download JSON credentials
- Share sheet with service account email

### 2. **Push to GitHub** (1 min)

```bash
cd /home/user/openclaud
git push -u origin claude/airtable-dashboard-vercel-nna37
```

### 3. **Deploy to Vercel** (2 min)

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Enter: `https://github.com/gabogibb/openclaud.git`
4. Select branch: `claude/airtable-dashboard-vercel-nna37`
5. Click "Import"
6. Add Environment Variables:
   ```
   AIRTABLE_API_KEY = <your_token>
   AIRTABLE_BASE_ID = appQHdlwIGlr1Asye
   GOOGLE_SHEETS_ID = 17S5kCMPvlHr9ZJoh0G5pvyYqrdXZSH5X8yvbqkQKPG0
   GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON = <json_string>
   ```
7. Click "Deploy"

### 4. **Verify** (instant)

- Wait for deployment to complete
- Click "Visit" to open dashboard
- Go to Settings tab
- Check "API Health Status" - should show ✓ Connected

## Detailed Steps

### Getting Airtable API Key

```
1. Visit https://airtable.com/account/api
2. Click "Generate token"
3. Set scope: "data.records:read"
4. Click "Create token"
5. Copy the token
```

### Getting Google Sheets Credentials

**Easy Method - Service Account:**
```
1. Go to https://console.cloud.google.com
2. Create new project (or select existing)
3. Search for "Google Sheets API" → Enable it
4. Go to "Service Accounts" (left menu)
5. Create Service Account
6. Create Key → JSON format → Download
7. Open downloaded JSON file
8. Copy entire content as one line
9. Share your Google Sheet with the service account email
```

**Convert JSON to single line:**
```bash
# On Mac/Linux:
cat service-account.json | tr -d '\n' | tr -d ' ' > key.txt

# On Windows PowerShell:
$json = Get-Content service-account.json -Raw
$json.Replace("`n","").Replace(" ","")
```

### Deploying with Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# In project directory
cd /home/user/openclaud

# Deploy
vercel

# Follow prompts to link project and add env vars
```

## After Deployment

### Check Everything Works

1. Open your Vercel dashboard URL
2. Go to Settings tab
3. See "API Health Status"
   - ✓ Airtable: Connected
   - ✓ Google Sheets: Connected
4. Navigate to other tabs
5. Data should load within 1-2 seconds

### Troubleshooting

**"API Health Status: Degraded"**
- Check env variables are exactly correct
- Verify API keys are still valid
- Ensure Google Sheet is shared with service account email

**"Failed to fetch data"**
- Check Vercel Functions logs
- Verify API rate limits not exceeded
- Try refreshing page

**Slow loading**
- Check Vercel Analytics
- First load may be slow (cold start)
- Subsequent loads should be fast due to caching

## Monitoring Your Dashboard

### View Performance
- Vercel Dashboard → Analytics
- Check function execution time
- Monitor bandwidth usage

### Enable Logging
- Vercel Dashboard → Settings → Functions
- View Runtime Logs
- Check for errors or warnings

## Customization

### Change Refresh Interval
- Settings tab → Adjust "Auto-refresh Interval"
- Default: 5 minutes
- Options: 5, 10, 15, 30 min or manual

### Add More Data
- Connect more Airtable tables
- Edit `lib/transforms/airtable.ts`
- Add transformation functions
- Deploy again

### Modify Dashboard Layout
- Edit pages in `app/dashboard/`
- Customize components in `components/`
- Redeploy to Vercel

## Cost Breakdown

**Typical usage:**
- Airtable: ~5-10 API calls/day → Free tier
- Google Sheets: ~5-10 calls/day → Free tier
- Vercel: ~1000 function invocations/day → Free tier

**Monthly cost:** $0 for most use cases

## Getting Help

1. **Deployment issues:** Check DEPLOYMENT.md
2. **Code questions:** See README.md
3. **API issues:**
   - Airtable: https://airtable.com/api
   - Google: https://developers.google.com/sheets/api
4. **Vercel support:** https://vercel.com/support

---

**You're all set! Deploy now and start monitoring your data in real-time! 🚀**
