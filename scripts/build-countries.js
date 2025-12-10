const axios = require('axios')
const fs = require('fs')
const path = require('path')

/**
 * Fetches countries data from the API and saves it as a JSON file
 */
async function buildCountries() {
  const apiUrl = process.env.NEXT_PUBLIC_OONI_API || 'https://api.ooni.io'
  const outputPath = path.join(__dirname, '..', 'data', 'countries.json')

  try {
    console.log('Fetching countries data from API...')
    const client = axios.create({ baseURL: apiUrl })
    const response = await client.get('/api/_/countries')

    // Ensure data directory exists
    const dataDir = path.dirname(outputPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Write the countries data to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(response.data.countries.map(c => ({
      alpha_2: c.alpha_2,
      name: c.name,
    })), null, 2))
    console.log(`✓ Countries data saved to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching countries data:', error.message)
    process.exit(1)
  }
}

buildCountries()

