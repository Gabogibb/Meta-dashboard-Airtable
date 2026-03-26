'use client'

import { useEffect, useState } from 'react'
import { transformABTest, transformFunnelRecord, transformMetaAd } from '@/lib/transforms/airtable'
import {
  calculateABTestMetrics,
  calculateFunnelMetrics,
  calculateAdsMetrics,
  ABTest,
  FunnelRecord,
  MetaAd,
} from '@/lib/transforms/airtable'

interface DashboardMetrics {
  abTests: ABTest[]
  funnelRecords: FunnelRecord[]
  metaAds: MetaAd[]
  abTestMetrics: ReturnType<typeof calculateABTestMetrics>
  funnelMetrics: ReturnType<typeof calculateFunnelMetrics>
  adsMetrics: ReturnType<typeof calculateAdsMetrics>
}

export function useMetrics() {
  const [data, setData] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/data/combined')

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const json = await response.json()

        // Transform data
        const abTests = (json.abTests || [])
          .map(transformABTest)
          .filter((t): t is ABTest => t !== null)

        const funnelRecords = (json.funnelData || [])
          .map(transformFunnelRecord)
          .filter((r): r is FunnelRecord => r !== null)

        const metaAds = (json.metaAds || []).map(transformMetaAd).filter((a): a is MetaAd => a !== null)

        setData({
          abTests,
          funnelRecords,
          metaAds,
          abTestMetrics: calculateABTestMetrics(abTests),
          funnelMetrics: calculateFunnelMetrics(funnelRecords),
          adsMetrics: calculateAdsMetrics(metaAds),
        })

        setLastUpdated(new Date())
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const refetch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/data/combined?cache=bypass')
      const json = await response.json()

      const abTests = (json.abTests || [])
        .map(transformABTest)
        .filter((t): t is ABTest => t !== null)

      const funnelRecords = (json.funnelData || [])
        .map(transformFunnelRecord)
        .filter((r): r is FunnelRecord => r !== null)

      const metaAds = (json.metaAds || []).map(transformMetaAd).filter((a): a is MetaAd => a !== null)

      setData({
        abTests,
        funnelRecords,
        metaAds,
        abTestMetrics: calculateABTestMetrics(abTests),
        funnelMetrics: calculateFunnelMetrics(funnelRecords),
        adsMetrics: calculateAdsMetrics(metaAds),
      })

      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, lastUpdated, refetch }
}
