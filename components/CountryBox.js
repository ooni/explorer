import { Box, Flex, Link, Text } from 'ooni-components'
import { FormattedMessage, useIntl } from 'react-intl'
import NLink from 'next/link'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import Flag from 'components/Flag'
import styled from 'styled-components'
import { GridBox } from 'components/VirtualizedGrid'

const StyledLink = styled(Link)`
&:hover {
  filter: none;
}
`

const StyledCountryName = styled(Text)`
`

const StyledBox = styled(Box)`
border: 1px solid ${props => props.theme.colors.gray3};
position: relative;
color: black;

&:hover {
  border-color: ${props => props.theme.colors.blue5};
  ${StyledCountryName} {
    color: ${props => props.theme.colors.blue5};
  }
}
`

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
              <StyledCountryName fontSize={1} fontWeight='bold' ml={2} lineHeight='24px'>{getLocalisedRegionName(c.country, intl.locale)}</StyledCountryName>
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