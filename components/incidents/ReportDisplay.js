import { Heading, Flex, Box, Text } from 'ooni-components'
import { Badge } from 'components/Badge'
import Flag from 'components/Flag'
import Markdown from 'markdown-to-jsx'
import { MATChartReportWrapper } from 'components/MATChart'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { useIntl } from 'react-intl'
import { formatLongDate } from 'utils'

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

const ReportDisplay = ({ report }) => {
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
            {getLocalisedRegionName(report.CCs[0], intl.locale)} {!!report?.ASNs?.length && <>({report.ASNs.map((as) => (`AS${as}`)).join(', ')})</>}
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
      <Text color="gray6" mb={4}>created by {report?.reported_by}</Text>
      <Box fontSize={18} lineHeight="1.5">{report?.text && <FormattedMarkdown>{report.text}</FormattedMarkdown>}</Box>
    </>
  )
}

export default ReportDisplay
