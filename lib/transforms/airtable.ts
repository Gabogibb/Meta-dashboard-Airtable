import { AirtableRecord } from '@/lib/api/airtable'

// AB Test transformation
export interface ABTest {
  id: string
  date: string
  testPeriod: string
  variantA: string
  variantAPageViews: number
  variantAConversions: number
  variantACR: number
  variantB: string
  variantBPageViews: number
  variantBConversions: number
  variantBCR: number
  crDifference: number
  currentLeader: string
  notes?: string
}

export function transformABTest(record: AirtableRecord): ABTest | null {
  const { fields } = record
  if (!fields.Date) return null

  return {
    id: record.id,
    date: fields.Date,
    testPeriod: fields['Test Period'] || '',
    variantA: fields['Variant A'] || '',
    variantAPageViews: parseFloat(fields['Variant A - Page Views'] || 0),
    variantAConversions: parseFloat(fields['Variant A - Conversions'] || 0),
    variantACR: parseFloat(fields['Variant A - CR'] || 0),
    variantB: fields['Variant B'] || '',
    variantBPageViews: parseFloat(fields['Variant B - Page Views'] || 0),
    variantBConversions: parseFloat(fields['Variant B - Conversions'] || 0),
    variantBCR: parseFloat(fields['Variant B - CR'] || 0),
    crDifference: parseFloat(fields['CR Difference'] || 0),
    currentLeader: fields['Current Leader'] || 'Unknown',
    notes: fields.Notes,
  }
}

// Funnel Data transformation
export interface FunnelRecord {
  id: string
  name: string
  email: string
  country: string
  eventType?: string
  signupDate: string
  sessionDate?: string
  timezone?: string
  cameToEvent?: string
  watchPercent?: string
  cameToReplay?: string
  replayWatchPercent?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export function transformFunnelRecord(record: AirtableRecord): FunnelRecord | null {
  const { fields } = record
  if (!fields.Name || !fields.Email) return null

  return {
    id: record.id,
    name: fields.Name,
    email: fields.Email,
    country: fields.Country || '',
    eventType: fields['Event Type'],
    signupDate: fields['Signup Date'] || '',
    sessionDate: fields['Session Date'],
    timezone: fields.Timezone,
    cameToEvent: fields['Came to Event'],
    watchPercent: fields['Watch %'],
    cameToReplay: fields['Came to Replay'],
    replayWatchPercent: fields['Replay Watch %'],
    utmSource: fields['UTM Source'],
    utmMedium: fields['UTM Medium'],
    utmCampaign: fields['UTM Campaign'],
  }
}

// Meta Ads transformation
export interface MetaAd {
  id: string
  adName: string
  dateStart: string
  campaignName: string
  adsetName: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  inlineLinkClicks: number
  inlineLinkCtr: number
  cpc: number
  cpm: number
  reach: number
  leads: number
  completeRegistrations: number
  purchases: number
}

export function transformMetaAd(record: AirtableRecord): MetaAd | null {
  const { fields } = record
  if (!fields.ad_name) return null

  return {
    id: record.id,
    adName: fields.ad_name,
    dateStart: fields.date_start || '',
    campaignName: fields.campaign_name || '',
    adsetName: fields.adset_name || '',
    spend: parseFloat(fields.spend || 0),
    impressions: parseFloat(fields.impressions || 0),
    clicks: parseFloat(fields.clicks || 0),
    ctr: parseFloat(fields.ctr || 0),
    inlineLinkClicks: parseFloat(fields.inline_link_clicks || 0),
    inlineLinkCtr: parseFloat(fields.inline_link_click_ctr || 0),
    cpc: parseFloat(fields.cpc || 0),
    cpm: parseFloat(fields.cpm || 0),
    reach: parseFloat(fields.reach || 0),
    leads: parseFloat(fields.lead || 0),
    completeRegistrations: parseFloat(fields.complete_registration || 0),
    purchases: parseFloat(fields.purchase || 0),
  }
}

// Aggregation functions
export function calculateABTestMetrics(tests: ABTest[]) {
  if (tests.length === 0) return null

  const latestTest = tests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

  return {
    totalTests: tests.length,
    averageCRDifference: tests.reduce((sum, t) => sum + Math.abs(t.crDifference), 0) / tests.length,
    latestTest,
    averageAConversions: tests.reduce((sum, t) => sum + t.variantAConversions, 0) / tests.length,
    averageBConversions: tests.reduce((sum, t) => sum + t.variantBConversions, 0) / tests.length,
  }
}

export function calculateFunnelMetrics(records: FunnelRecord[]) {
  if (records.length === 0) return null

  const attendees = records.filter((r) => r.cameToEvent === 'Yes' || r.cameToEvent === 'yes')
  const replayWatchers = records.filter((r) => r.cameToReplay === 'Yes' || r.cameToReplay === 'yes')

  return {
    totalSignups: records.length,
    attendees: attendees.length,
    attendanceRate: ((attendees.length / records.length) * 100).toFixed(1),
    replayWatchers: replayWatchers.length,
    replayWatchRate: ((replayWatchers.length / records.length) * 100).toFixed(1),
    topCountries: getTopValues(records, 'country', 5),
    topTimeZones: getTopValues(records, 'timezone', 5),
    topSources: getTopValues(records, 'utmSource', 5),
  }
}

export function calculateAdsMetrics(ads: MetaAd[]) {
  if (ads.length === 0) return null

  const totalSpend = ads.reduce((sum, ad) => sum + ad.spend, 0)
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0)
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0)
  const totalLeads = ads.reduce((sum, ad) => sum + ad.leads, 0)
  const totalRegistrations = ads.reduce((sum, ad) => sum + ad.completeRegistrations, 0)
  const totalPurchases = ads.reduce((sum, ad) => sum + ad.purchases, 0)

  return {
    totalSpend: totalSpend.toFixed(2),
    totalImpressions,
    totalClicks,
    averageCTR: ((totalClicks / totalImpressions) * 100).toFixed(2),
    averageCPM: (totalSpend / (totalImpressions / 1000)).toFixed(2),
    totalLeads,
    costPerLead: (totalSpend / totalLeads).toFixed(2),
    totalRegistrations,
    costPerRegistration: (totalSpend / totalRegistrations).toFixed(2),
    totalPurchases,
    costPerPurchase: totalPurchases > 0 ? (totalSpend / totalPurchases).toFixed(2) : 'N/A',
  }
}

function getTopValues(
  records: any[],
  field: string,
  limit: number
): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>()

  records.forEach((record) => {
    const value = record[field]
    if (value) {
      counts.set(value, (counts.get(value) || 0) + 1)
    }
  })

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
