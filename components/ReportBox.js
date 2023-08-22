import { Flex, Heading, Box, Button, Text } from 'ooni-components'
import Flag from 'components/Flag'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { formatLongDate } from 'utils'
import { useIntl } from 'react-intl'
import NLink from 'next/link'

const ReportBox = ({country, startDate, endDate, title, id, ...props}) => {
  const intl = useIntl()

  return (
    <Box 
      py={4}
      px={24}
      sx={{border: '1px solid', borderColor: 'gray3', borderLeft: '10px solid', borderLeftColor: 'blue5'}}
    >
      {country && (
        <Flex alignItems="center">
          <Flag countryCode={country} size={32} />
          <Heading h={4} ml={2}>
            {getLocalisedRegionName(country, intl.locale)}
          </Heading>
        </Flex>
      )}
      <Text color="gray6">{startDate && formatLongDate(startDate, intl.locale)} - {endDate ? formatLongDate(endDate, intl.locale) : 'ongoing'}</Text>
      <p>{title}</p>
      {/* <p>{summary}</p> */}
      <Box textAlign="center" mt={2}>
        <NLink href={`/incidents/${id}`}>
          <Button btnSize="small" hollow>Read More</Button>
        </NLink>
      </Box>
    </Box>
  )
}

export default ReportBox