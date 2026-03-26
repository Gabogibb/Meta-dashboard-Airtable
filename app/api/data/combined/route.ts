import { NextRequest, NextResponse } from 'next/server'
import { getABTests, getFunnelData, getMetaAdsData } from '@/lib/api/airtable'
import { getCachedData, setCachedData } from '@/lib/api/cache'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cacheKey = 'combined-data'

    // Try to get from cache first
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        source: 'cache',
        timestamp: new Date().toISOString(),
      })
    }

    // Fetch data in parallel
    const [abTests, funnelData, metaAds] = await Promise.all([
      getABTests().catch((err) => {
        console.error('Failed to fetch AB tests:', err)
        return []
      }),
      getFunnelData().catch((err) => {
        console.error('Failed to fetch funnel data:', err)
        return []
      }),
      getMetaAdsData().catch((err) => {
        console.error('Failed to fetch Meta ads data:', err)
        return []
      }),
    ])

    // Calculate summary metrics
    const summary = {
      totalABTests: abTests.length,
      totalRegistrations: funnelData.length,
      totalAdRecords: metaAds.length,
    }

    const response = {
      summary,
      abTests,
      funnelData,
      metaAds,
      lastUpdated: new Date().toISOString(),
    }

    // Cache for 5 minutes
    setCachedData(cacheKey, response, 5 * 60 * 1000)

    return NextResponse.json({
      ...response,
      source: 'live',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in combined data endpoint:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch combined data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
