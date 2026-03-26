import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID || ''
)

export interface AirtableRecord {
  id: string
  fields: Record<string, any>
  createdTime: string
}

// Table IDs
export const TABLE_IDS = {
  AB_TESTS: 'tblhhAZ0XyNMNrFHm',
  FUNNEL_DATA: 'tbldiotpP9xtOscnp',
  META_ADS: 'tblL36xPzFKfqBZPb',
  TASKS: 'tblxgJIWLCwmSW5oA',
}

export async function fetchAirtableRecords(
  tableId: string,
  options?: {
    view?: string
    pageSize?: number
    maxRecords?: number
  }
): Promise<AirtableRecord[]> {
  try {
    const records: AirtableRecord[] = []
    const table = base(tableId)

    await new Promise((resolve, reject) => {
      table
        .select({
          view: options?.view || 'Grid view',
          pageSize: options?.pageSize || 100,
          maxRecords: options?.maxRecords || 1000,
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            records.push(
              ...pageRecords.map((record) => ({
                id: record.id,
                fields: record.fields,
                createdTime: record._rawJson.createdTime,
              }))
            )
            fetchNextPage()
          },
          (err) => {
            if (err) reject(err)
            else resolve(null)
          }
        )
    })

    return records
  } catch (error) {
    console.error(`Error fetching Airtable records from ${tableId}:`, error)
    throw error
  }
}

export async function getABTests() {
  return fetchAirtableRecords(TABLE_IDS.AB_TESTS, {
    pageSize: 100,
  })
}

export async function getFunnelData() {
  return fetchAirtableRecords(TABLE_IDS.FUNNEL_DATA, {
    pageSize: 100,
  })
}

export async function getMetaAdsData() {
  return fetchAirtableRecords(TABLE_IDS.META_ADS, {
    pageSize: 100,
  })
}
