import { Heading, Flex, Box, Text } from 'ooni-components'
import { Badge } from 'components/Badge'
import Flag from 'components/Flag'
import Markdown from 'markdown-to-jsx'
import { MATChartWrapper } from 'components/MATChart'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { useIntl } from 'react-intl'
import { formatLongDate } from 'utils'
import NLink from 'next/link'

const FormattedMarkdown = ({ children }) => {
  return (
    <Markdown
      options={{
        overrides: {
          MAT: {
            component: MATChartWrapper,
          },
        },
      }}
    >
      {children}
    </Markdown>
  )
}

const FindingDisplay = ({ incident }) => {
  const intl = useIntl()

  return (
    <>
      <Heading h={1} mt={4} mb={4} pb={3} sx={{borderBottom: '1px solid', borderColor: 'gray3'}}>
        {incident?.title}
      </Heading>
      {!!incident?.CCs?.length && (
        <Flex alignItems="center">
          <Flag countryCode={incident.CCs[0]} size={32} />
          <Heading h={3} ml={2}>
            {getLocalisedRegionName(incident.CCs[0], intl.locale)}
          </Heading>
        </Flex>
      )}
      <Text color="gray6" mb={3}>{incident?.start_time && formatLongDate(incident?.start_time, intl.locale)} - {incident?.end_time ? formatLongDate(incident?.end_time, intl.locale) : 'ongoing'}</Text>
      {!!incident?.tags?.length && (
        <Flex mb={3}>
          {incident.tags.map((tag) => (
            <Box key={tag} mr={2}>
              <Badge>{tag}</Badge>
            </Box>
          ))}
        </Flex>
      )}
      <Text color="gray6" mb={4}>created by {incident?.reported_by} on {incident?.create_time && formatLongDate(incident?.create_time, intl.locale)}</Text>
      {!!incident?.ASNs?.length && <Box mb={3} fontSize={18} lineHeight="1.5">Network: {incident.ASNs.map((as) => (<NLink key={as} href={`/as/AS${as}`}>{`AS${as}`}</NLink>)).reduce((prev, curr) => (prev ? [prev, ', ', curr] : curr), null)}</Box>}
      <Box fontSize={18} lineHeight="1.5">{incident?.text && <FormattedMarkdown>{incident.text}</FormattedMarkdown>}</Box>
    </>
  )
}

export default FindingDisplay
