import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    airtable: !!process.env.AIRTABLE_API_KEY && !!process.env.AIRTABLE_BASE_ID,
    googleSheets: !!process.env.GOOGLE_SHEETS_ID,
  }

  const allHealthy = Object.values(checks).every((v) => v)

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: allHealthy ? 200 : 503 }
  )
}
