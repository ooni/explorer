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
    const response = await fetch(`${apiUrl}/api/_/countries`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()

    // Ensure data directory exists
    const dataDir = path.dirname(outputPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Write the countries data to JSON file. `count` is the measurement
    // count is the measurement count used for default suggestions in ExploreBar.
    fs.writeFileSync(outputPath, JSON.stringify(data.countries.map(c => ({
      alpha_2: c.alpha_2,
      name: c.name,
      count: c.count || 0,
    })), null, 2))
    console.log(`✓ Countries data saved to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching countries data:', error.message)
    process.exit(1)
  }
}

buildCountries()
