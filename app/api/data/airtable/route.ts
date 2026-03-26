import { NextRequest, NextResponse } from 'next/server'
import { getABTests, getFunnelData, getMetaAdsData } from '@/lib/api/airtable'
import { getCachedData, setCachedData } from '@/lib/api/cache'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table') || 'all'

    const cacheKey = `airtable:${table}`

    // Try cache first
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        source: 'cache',
      })
    }

    let data: any = {}

    if (table === 'all' || table === 'ab-tests') {
      data.abTests = await getABTests()
    }
    if (table === 'all' || table === 'funnel') {
      data.funnelData = await getFunnelData()
    }
    if (table === 'all' || table === 'meta-ads') {
      data.metaAds = await getMetaAdsData()
    }

    // Cache for 5 minutes
    setCachedData(cacheKey, data, 5 * 60 * 1000)

    return NextResponse.json({
      ...data,
      source: 'live',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching Airtable data:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch Airtable data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
