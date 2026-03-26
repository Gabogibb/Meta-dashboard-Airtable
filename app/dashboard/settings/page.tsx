'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setHealth(data)
      } catch (error) {
        console.error('Failed to check health:', error)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings & Configuration</h1>

      {/* API Health Status */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">API Health Status</h2>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-200 rounded"></div>
            <div className="h-6 bg-slate-200 rounded"></div>
          </div>
        ) : health ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Overall Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  health.status === 'healthy'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {health.status === 'healthy' ? '✓ Healthy' : '⚠ Degraded'}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Data Sources</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-700">Airtable</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      health.checks.airtable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {health.checks.airtable ? '✓ Connected' : '✗ Not Configured'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-700">Google Sheets</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      health.checks.googleSheets
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {health.checks.googleSheets ? '✓ Connected' : '✗ Not Configured'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-700">Failed to check API health</p>
        )}
      </div>

      {/* Configuration Guide */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Configuration Guide</h2>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Environment Variables Required:</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
              <li>AIRTABLE_API_KEY - Your Airtable API token</li>
              <li>AIRTABLE_BASE_ID - Your Airtable base ID</li>
              <li>GOOGLE_SHEETS_ID - Your Google Sheet ID</li>
              <li>GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON (optional) - Service account credentials</li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">How to Get Credentials:</h3>
            <ul className="space-y-2">
              <li>
                <strong>Airtable:</strong> Visit{' '}
                <a
                  href="https://airtable.com/account/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  airtable.com/account/api
                </a>
              </li>
              <li>
                <strong>Google Sheets:</strong> Create a service account at{' '}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  console.cloud.google.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Refresh Settings */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Refresh Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Auto-refresh Interval</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900">
              <option value="5">Every 5 minutes</option>
              <option value="10">Every 10 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
              <option value="0">Manual only</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">Automatic refresh reduces API usage and cost</p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Cache Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-sm text-slate-700">Enable caching (reduces API calls)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-sm text-slate-700">Show cached data age indicator</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Deployment to Vercel</h2>
        <p className="text-blue-800">
          To deploy this dashboard to Vercel, push your code to GitHub and connect the repository to Vercel.
          Then set the environment variables in your Vercel project settings.
        </p>
      </div>
    </div>
  )
}
