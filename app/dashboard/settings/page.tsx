export default function SettingsPage() {
  const hasAirtable = !!process.env.AIRTABLE_API_KEY
  const hasSheets = !!process.env.GOOGLE_SHEETS_ID

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      {/* API Status */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Source Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
            <span className="text-sm text-slate-700">Airtable API</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${hasAirtable ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {hasAirtable ? 'Connected (Live Sync)' : 'Using Static Data'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
            <span className="text-sm text-slate-700">Google Sheets</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${hasSheets ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
              {hasSheets ? 'Connected' : 'Not Configured'}
            </span>
          </div>
        </div>
      </div>

      {/* Sync Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Data Sync</h2>
        <p className="text-blue-800 text-sm">
          When connected to Airtable, data is automatically refreshed every 5 minutes via Next.js ISR (Incremental Static Regeneration).
          The dashboard will always show the latest data from your Airtable base.
        </p>
        <p className="text-blue-700 text-sm mt-2">
          Without an API key, the dashboard displays a snapshot of data from March 26, 2026.
        </p>
      </div>

      {/* Setup Guide */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Environment Variables</h2>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-slate-50 rounded font-mono text-xs">
            <p>AIRTABLE_API_KEY=your_token</p>
            <p>AIRTABLE_BASE_ID=appQHdlwIGlr1Asye</p>
            <p>GOOGLE_SHEETS_ID=17S5kCMPvlHr9ZJoh0G5pvyYqrdXZSH5X8yvbqkQKPG0</p>
          </div>
          <p className="text-slate-600">
            Set these in your Vercel project settings under Environment Variables.
            Get your Airtable API key from <a href="https://airtable.com/create/tokens" target="_blank" className="text-blue-600 hover:underline">airtable.com/create/tokens</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
