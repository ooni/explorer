import Flag from 'components/Flag'
import { GridBox } from 'components/VirtualizedGrid'
import { Box, Flex, Text } from 'ooni-components'

const CountryList = ({ countries, itemsPerRow = 6, gridGap = 3 }) => {
  const gridTemplateColumns = ['1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr', [...Array(itemsPerRow)].map((i) => ('1fr')).join(' ')]

  return (
    <Box sx={{
      display: 'grid',
      gridGap,
      gridTemplateColumns 
    }}>
      {countries.map((c) => (
        <GridBox
          key={c.alpha_2}
          href={`/country/${c.alpha_2}`}
          title={
            <Flex mb={2} alignItems='center'>
              <Box alignSelf='start'><Flag countryCode={c.alpha_2} size={22} border /></Box>
              <Text fontSize={1} fontWeight='bold' ml={2} lineHeight='24px'>{c.localisedName}</Text>
            </Flex>
          }
          count={c.count}
        />
        ))
      }
    </Box>
  )
}

export default CountryList