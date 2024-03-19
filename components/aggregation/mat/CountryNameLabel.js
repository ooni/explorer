import { Box } from 'ooni-components'
import { useIntl } from 'react-intl'
import { localisedCountries } from 'utils/i18nCountries'

const CountryNameLabel = ({ countryCode, ...props }) => {
  const intl = useIntl()
  const country = localisedCountries(intl.locale).find(
    (o) => o.iso3166_alpha2 === countryCode,
  )
  const name = country ? country.localisedCountryName : countryCode
  return <Box {...props}>{name}</Box>
}

export default CountryNameLabel
