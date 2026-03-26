// Server-side Airtable data fetching
// Uses Airtable REST API directly (no SDK dependency needed)

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || ''
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appQHdlwIGlr1Asye'

const TABLE_IDS = {
  AB_TESTS: 'tblhhAZ0XyNMNrFHm',
  FUNNEL: 'tbldiotpP9xtOscnp',
  META_ADS: 'tblL36xPzFKfqBZPb',
}

interface AirtableResponse {
  records: Array<{
    id: string
    createdTime: string
    fields: Record<string, any>
  }>
  offset?: string
}

async function fetchTable(tableId: string, maxRecords = 1000): Promise<any[]> {
  const allRecords: any[] = []
  let offset: string | undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`)
    url.searchParams.set('pageSize', '100')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!res.ok) {
      throw new Error(`Airtable API error: ${res.status} ${res.statusText}`)
    }

    const data: AirtableResponse = await res.json()
    allRecords.push(...data.records)
    offset = data.offset

    if (allRecords.length >= maxRecords) break
  } while (offset)

  return allRecords
}

// Transform A/B test records
function transformABTests(records: any[]) {
  return records
    .map((r: any) => {
      const f = r.fields || r.cellValuesByFieldId || {}
      const date = f['Date'] || f.fldqUsROYHdCYNsSs
      if (!date) return null

      const variantACR = parseFloat(f['Variant A - CR'] || f.fldjigw39s5PIoA6e || 0)
      const variantBCR = parseFloat(f['Variant B - CR'] || f.fldMwvz3B5Dz5Awmo || 0)
      const leader = f['Current Leader'] || f.fldvdRZ4WkPA2I3tC
      const leaderName = typeof leader === 'object' ? leader?.name : leader

      return {
        date,
        testPeriod: f['Test Period'] || f.fldqA2nOJd51FVkQH || '',
        variantA: f['Variant A'] || f.fldkF8H2RrrXMRA8p || '',
        variantAPageViews: parseInt(f['Variant A - Page Views'] || f.fldXgYjUI5tb1vM8x || 0),
        variantAConversions: parseInt(f['Variant A - Conversions'] || f.fldKKZAhWFrmZsV0w || 0),
        variantACR: Math.round(variantACR * 1000) / 10,
        variantB: f['Variant B'] || f.fldCcT29JxalB4pLN || '',
        variantBPageViews: parseInt(f['Variant B - Page Views'] || f.fldO97YU8WRa4rBJ8 || 0),
        variantBConversions: parseInt(f['Variant B - Conversions'] || f.fldRzb7dDmWuZtJSN || 0),
        variantBCR: Math.round(variantBCR * 1000) / 10,
        crDifference: Math.round((variantBCR - variantACR) * 1000) / 10,
        currentLeader: leaderName || 'Unknown',
        notes: f['Notes'] || f.fldz3Y6KmgHM8BY0X || '',
      }
    })
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Transform funnel records
function transformFunnel(records: any[]) {
  const countries: Record<string, number> = {}
  const timezones: Record<string, number> = {}
  const eventTypes: Record<string, number> = {}
  let attended = 0
  let replay = 0
  const registrants: any[] = []

  for (const r of records) {
    const f = r.fields || r.cellValuesByFieldId || {}
    const country = f['Country'] || f.fldRQogA6vWMMOmqO || 'Unknown'
    const tz = f['Timezone'] || f.fldcQSHnOVfO2C7Ax || ''
    const et = f['Event Type'] || f.fldkPF4inD1OmRsCr
    const came = f['Came to Event'] || f.fldaXRRqdAxATc8Ll
    const rep = f['Came to Replay'] || f.fldJKoUqKT0pX0Hys

    countries[country] = (countries[country] || 0) + 1
    if (tz) timezones[tz] = (timezones[tz] || 0) + 1

    const etName = typeof et === 'object' ? et?.name : et
    if (etName) eventTypes[etName] = (eventTypes[etName] || 0) + 1

    const cameName = typeof came === 'object' ? came?.name : came
    if (cameName === 'Yes') attended++

    const repName = typeof rep === 'object' ? rep?.name : rep
    if (repName === 'Yes') replay++

    if (registrants.length < 50) {
      registrants.push({
        name: f['Name'] || f.fldebdSAIMpOxjCgi || '',
        email: f['Email'] || f.fldgcjKSioRhmifam || '',
        country,
        eventType: etName || '',
        signupDate: f['Signup Date'] || f.fld735NYtOJW48a3I || '',
        timezone: tz,
        cameToEvent: cameName || '',
        watchPercent: f['Watch %'] || f.fld4FSU4cM0D98Cor || '',
        cameToReplay: repName || '',
        replayWatchPercent: f['Replay Watch %'] || f.fldvkjiEThWA23uPZ || '',
      })
    }
  }

  const total = records.length
  const sortedCountries = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))
  const sortedTimezones = Object.entries(timezones)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))
  const sortedEventTypes = Object.entries(eventTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  return {
    totalSignups: total,
    attended,
    attendanceRate: total > 0 ? Math.round((attended / total) * 1000) / 10 : 0,
    replayWatchers: replay,
    replayRate: total > 0 ? Math.round((replay / total) * 1000) / 10 : 0,
    topCountries: sortedCountries,
    topTimezones: sortedTimezones,
    eventTypes: sortedEventTypes,
    registrants,
  }
}

// Transform ads records
function transformAds(records: any[]) {
  let totalSpend = 0, totalImpressions = 0, totalClicks = 0, totalReach = 0, totalLeads = 0
  const campaigns: Record<string, any> = {}
  const adsList: any[] = []

  for (const r of records) {
    const f = r.fields || r.cellValuesByFieldId || {}
    const spend = parseFloat(f['spend'] || f.fldVqWvL3Jd2bFXro || 0)
    const impressions = Math.round(parseFloat(f['impressions'] || f.fldLK3w2SqhrizxmW || 0))
    const clicks = Math.round(parseFloat(f['clicks'] || f.fldy2fZlKqJvWfTSJ || 0))
    const reach = Math.round(parseFloat(f['reach'] || f.fldTwakc8L3BJL4qU || 0))
    const leads = Math.round(parseFloat(f['lead'] || f.fldiBX5WcaqA0MdW5 || 0))
    const camp = f['campaign_name'] || f.fldXzJoWpfCAn76Xb || 'Unknown'

    totalSpend += spend
    totalImpressions += impressions
    totalClicks += clicks
    totalReach += reach
    totalLeads += leads

    if (!campaigns[camp]) campaigns[camp] = { spend: 0, impressions: 0, clicks: 0, leads: 0, count: 0 }
    campaigns[camp].spend += spend
    campaigns[camp].impressions += impressions
    campaigns[camp].clicks += clicks
    campaigns[camp].leads += leads
    campaigns[camp].count++

    adsList.push({
      adName: f['ad_name'] || f.fldr37e2nWyBLPr1Z || '',
      dateStart: f['date_start'] || f.fldHONGTcLZFBQhro || '',
      campaignName: camp,
      adsetName: f['adset_name'] || f.fld1k5OI4e9OhEaHW || '',
      spend: Math.round(spend * 100) / 100,
      impressions, clicks,
      ctr: Math.round(parseFloat(f['ctr'] || f.flduxVMD1u9QwyNuv || 0) * 100) / 100,
      cpc: Math.round(parseFloat(f['cpc'] || f.fldvTBb9nqKSfRKph || 0) * 100) / 100,
      cpm: Math.round(parseFloat(f['cpm'] || f.fldK46uKZV9f57feT || 0) * 100) / 100,
      reach, leads,
      costPerLead: Math.round(parseFloat(f['cost_per_lead'] || f.fldbI0aJPOoxVCEZS || 0) * 100) / 100,
    })
  }

  return {
    summary: {
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalImpressions, totalClicks, totalReach, totalLeads,
      averageCTR: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
      averageCPC: totalClicks > 0 ? Math.round((totalSpend / totalClicks) * 100) / 100 : 0,
      averageCPM: totalImpressions > 0 ? Math.round((totalSpend / (totalImpressions / 1000)) * 100) / 100 : 0,
      costPerLead: totalLeads > 0 ? Math.round((totalSpend / totalLeads) * 100) / 100 : 0,
    },
    campaigns: Object.entries(campaigns)
      .map(([name, v]: [string, any]) => ({ name, ...v, spend: Math.round(v.spend * 100) / 100 }))
      .sort((a, b) => b.spend - a.spend),
    ads: adsList.sort((a, b) => b.spend - a.spend).slice(0, 50),
    totalRecords: records.length,
  }
}

export async function fetchDashboardData() {
  if (!AIRTABLE_API_KEY) {
    // Fall back to static data
    const staticData = await import('@/data/dashboard-data.json')
    return { ...staticData.default, source: 'static' }
  }

  try {
    const [abRaw, funnelRaw, adsRaw] = await Promise.all([
      fetchTable(TABLE_IDS.AB_TESTS),
      fetchTable(TABLE_IDS.FUNNEL),
      fetchTable(TABLE_IDS.META_ADS),
    ])

    return {
      lastUpdated: new Date().toISOString(),
      abTests: transformABTests(abRaw),
      funnel: transformFunnel(funnelRaw),
      ads: transformAds(adsRaw),
      source: 'live',
    }
  } catch (error) {
    console.error('Airtable fetch failed, using static data:', error)
    const staticData = await import('@/data/dashboard-data.json')
    return { ...staticData.default, source: 'static-fallback' }
  }
}
