import { google } from 'googleapis'

const sheets = google.sheets('v4')

// Initialize auth based on environment variables
function getAuthClient() {
  if (process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(
      process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON
    )
    return new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
  }

  // Fallback to API key (read-only)
  return new google.auth.GoogleAuth({
    credentials: {
      type: 'authorized_user',
      client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
      client_secret: process.env.GOOGLE_SHEETS_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN,
    },
  })
}

export interface SheetRow {
  [key: string]: any
}

export async function fetchSheetData(
  spreadsheetId: string,
  range: string
): Promise<SheetRow[]> {
  try {
    const auth = getAuthClient()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    })

    const values = response.data.values || []
    if (values.length === 0) return []

    // First row is headers
    const headers = values[0]
    const rows: SheetRow[] = values.slice(1).map((row) => {
      const obj: SheetRow = {}
      headers.forEach((header, index) => {
        obj[header] = row[index] || null
      })
      return obj
    })

    return rows
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error)
    throw error
  }
}

export async function getAnalyticsSheetData() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ID environment variable not set')
  }

  // Fetch from the specified sheet (default to first sheet)
  // You can adjust the range as needed
  return fetchSheetData(spreadsheetId, 'Sheet1!A:Z')
}
