import { useIntl } from 'react-intl'
import { localisedCountries } from 'utils/i18nCountries'

const CountryNameLabel = ({ countryCode, ...props }) => {
  const intl = useIntl()
  const country = localisedCountries(intl.locale).find(
    (o) => o.iso3166_alpha2 === countryCode,
  )
  const name = country ? country.localisedCountryName : countryCode
  return <div {...props}>{name}</div>
}

export default CountryNameLabel
