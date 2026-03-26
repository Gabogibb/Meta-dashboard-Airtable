# Analytics Dashboard

A real-time analytics dashboard that combines data from Airtable and Google Sheets, deployed to Vercel.

## Features

- **Multi-source Data**: Aggregates data from Airtable (A/B Tests, Funnel Data, Meta Ads) and Google Sheets
- **Real-time Monitoring**: Live data with 5-30 minute refresh intervals
- **Comprehensive Dashboards**:
  - Overview: Key metrics at a glance
  - A/B Testing: Test comparisons and historical results
  - Funnel Analytics: Registration and event attendance metrics
  - Meta Ads: Campaign performance and ROI
  - Settings: Configuration and refresh controls
- **Intelligent Caching**: Reduces API calls while keeping data fresh
- **Responsive Design**: Works on desktop, tablet, and mobile

## Quick Start

### Prerequisites

- Node.js 18+
- Airtable account with API key
- Google Sheets with API access

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your credentials:
   - `AIRTABLE_API_KEY`: Get from https://airtable.com/account/api
   - `AIRTABLE_BASE_ID`: From your Airtable base URL
   - `GOOGLE_SHEETS_ID`: From the Google Sheet URL
   - Google Sheets authentication (see below)

3. **Google Sheets Setup:**

   **Option A: Service Account (Recommended)**
   - Go to https://console.cloud.google.com/
   - Create a new project
   - Enable Google Sheets API
   - Create a service account and download JSON key
   - Share your Google Sheet with the service account email
   - Set `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` in `.env.local`

   **Option B: API Key (Read-only)**
   - Enable Google Sheets API in Cloud Console
   - Create an API key
   - Share your Google Sheet publicly or with specific emails
   - Set other Google Sheets env vars as needed

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000/dashboard

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial dashboard setup"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com/new
   - Connect your GitHub repository
   - Add environment variables:
     - `AIRTABLE_API_KEY`
     - `AIRTABLE_BASE_ID`
     - `GOOGLE_SHEETS_ID`
     - Google Sheets authentication variables
   - Click Deploy

3. **Access your dashboard:**
   - Your live URL will be shown (e.g., `https://your-dashboard.vercel.app`)

## API Endpoints

- `GET /api/data/combined` - All aggregated data
- `GET /api/data/airtable?table=all|ab-tests|funnel|meta-ads` - Airtable data
- `GET /api/health` - Health check

## Data Sources

### Airtable Tables
- **A/B Test Tracker**: Daily conversion rate tracking with variant comparisons
- **EW-3A Funnel Data**: Webinar registrant metrics and event attendance
- **Meta Ads Data**: Campaign performance and ROI metrics

### Google Sheets
- Supplementary analytics data (configured via GOOGLE_SHEETS_ID)

## Architecture

```
Client (Next.js React Components)
        ↓
Next.js API Routes (/api/*)
        ↓
Data Clients
├─ Airtable SDK
├─ Google Sheets API
└─ Cache Layer
        ↓
External APIs
```

## Caching Strategy

- **TTL**: 5-30 minutes per data source
- **Backend**: In-memory (development) / Vercel KV (production)
- **Manual Refresh**: Available via API endpoints

## Performance Optimization

- Server-side data fetching (secure API keys)
- Response caching to reduce API calls
- Lazy loading of chart components
- Responsive grid layouts with Tailwind CSS

## Troubleshooting

**"Failed to fetch data" error:**
- Check API keys in environment variables
- Verify Airtable base ID is correct
- Confirm Google Sheets is shared with service account

**Data not updating:**
- Check `/api/health` endpoint
- Verify cache TTL settings
- Check browser console for errors

**Slow performance:**
- Check Vercel function logs
- Reduce cache TTL to update more frequently
- Consider paginating large datasets

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Data Visualization**: Recharts, Tremor
- **State Management**: React Query
- **Data Validation**: Zod
- **APIs**: Airtable SDK, Google Sheets API
- **Deployment**: Vercel

## License

MIT
