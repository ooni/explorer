import { Box } from 'ooni-components'
import { localisedCountries } from 'utils/i18nCountries'
import { useIntl } from 'react-intl'

const CountryNameLabel = ({ countryCode, ...props }) => {
  const intl = useIntl()
  const country = localisedCountries(intl.locale).find(o => o.iso3166_alpha2 === countryCode)
  const name = country ? country.localisedCountryName : countryCode
  return (
    <Box {...props}>{name}</Box>
  )
}

export default CountryNameLabel