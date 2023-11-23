import { Box, Flex, Text } from 'ooni-components'
import { useIntl } from 'react-intl'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import Flag from 'components/Flag'
import { GridBox } from 'components/VirtualizedGrid'

const CountryList = ({ countries, itemsPerRow = 6, gridGap = 3 }) => {
  const intl = useIntl()
  const gridTemplateColumns = ['1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr', [...Array(itemsPerRow)].map((i) => ('1fr')).join(' ')]

  return (
    <Box sx={{
      display: 'grid',
      gridGap,
      gridTemplateColumns 
    }}>
      {countries.map((c) => (
        <GridBox
          key={c.country}
          href={`/country/${c.country}`}
          title={
            <Flex mb={2} alignItems='center'>
              <Box alignSelf='start'><Flag countryCode={c.country} size={22} border /></Box>
              <Text fontSize={1} fontWeight='bold' ml={2} lineHeight='24px'>{getLocalisedRegionName(c.country, intl.locale)}</Text>
            </Flex>
          }
          count={c.measurements}
        />
        ))
      }
    </Box>
  )
}

export default CountryList