import { Heading, Flex, Box, Text } from 'ooni-components'
import { Badge } from 'components/Badge'
import Flag from 'components/Flag'
import Markdown from 'markdown-to-jsx'
import { MATChartReportWrapper } from 'components/MATChart'
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
            component: MATChartReportWrapper,
          },
        },
      }}
    >
      {children}
    </Markdown>
  )
}

const FindingDisplay = ({ report }) => {
  const intl = useIntl()

  return (
    <>
      <Heading h={1} mt={4} mb={4} pb={3} sx={{borderBottom: '1px solid', borderColor: 'gray3'}}>
        {report?.title}
      </Heading>
      {!!report?.CCs?.length && (
        <Flex alignItems="center">
          <Flag countryCode={report.CCs[0]} size={32} />
          <Heading h={3} ml={2}>
            {getLocalisedRegionName(report.CCs[0], intl.locale)}
          </Heading>
        </Flex>
      )}
      <Text color="gray6" mb={3}>{report?.start_time && formatLongDate(report?.start_time, intl.locale)} - {report?.end_time ? formatLongDate(report?.end_time, intl.locale) : 'ongoing'}</Text>
      {!!report?.tags?.length && (
        <Flex mb={3}>
          {report.tags.map((tag) => (
            <Box key={tag} mr={2}>
              <Badge>{tag}</Badge>
            </Box>
          ))}
        </Flex>
      )}
      <Text color="gray6" mb={4}>created by {report?.reported_by} on {report?.create_time && formatLongDate(report?.create_time, intl.locale)}</Text>
      {!!report?.ASNs?.length && <Box mb={3} fontSize={18} lineHeight="1.5">Network: {report.ASNs.map((as) => (<NLink key={as} href={`/as/AS${as}`}>{`AS${as}`}</NLink>)).reduce((prev, curr) => (prev ? [prev, ', ', curr] : curr), null)}</Box>}
      <Box fontSize={18} lineHeight="1.5">{report?.text && <FormattedMarkdown>{report.text}</FormattedMarkdown>}</Box>
    </>
  )
}

export default FindingDisplay
