import { Box } from 'ooni-components'
import { countryList } from 'country-util'

const CountryNameLabel = ({ countryCode, ...props }) => {
  const country = countryList.find(o => o.iso3166_alpha2 === countryCode)
  const name = country ? country.name : countryCode
  return (
    <Box {...props}>{name}</Box>
  )
}

export default CountryNameLabel