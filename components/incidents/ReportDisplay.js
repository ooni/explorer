import { Heading, Flex, Box, Text } from 'ooni-components'
import { Badge } from 'components/Badge'
import Flag from 'components/Flag'
import Markdown from 'markdown-to-jsx'
import { MATChartReportWrapper } from 'components/MATChart'
import { getLocalisedRegionName } from '../../utils/i18nCountries'
import { useIntl } from 'react-intl'

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

const formatDate = (date, locale) => {
 return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(date))
}

const ReportDisplay = ({ report }) => {
  const intl = useIntl()

  return (
    <>
      <Heading h={1} mt={4} mb={3} sx={{borderBottom: '1px solid', borderColor: 'gray3'}}>{report?.title}</Heading>
      {/* <p>Published: {report.published}</p> */}
      {/* {!!report?.CCs?.length && <p>Countries: {report.CCs.join(', ')}</p>} */}
      {/* {!!report?.ASNs?.length && <p>ASNs: {report.ASNs.join(', ')}</p>} */}
      {!!report?.CCs?.length && (
        <Flex alignItems="center">
          <Flag countryCode={report.CCs[0]} size={32} />
          <Heading h={3} ml={2}>
            {getLocalisedRegionName(report.CCs[0], intl.locale)} {!!report?.ASNs?.length && <>({report.ASNs.map((as) => (`AS${as}`)).join(', ')})</>}
          </Heading>
        </Flex>
      )}
      <p>{formatDate(report?.start_time, intl.locale)} - {report?.end_time ? formatDate(report?.end_time, intl.locale) : 'ongoing'}</p>
      <p>created by {report?.reported_by}</p>
      {!!report?.tags?.length && (
        <Flex>
          {report.tags.map((tag) => (
            <Box key={tag} mr={2}>
              <Badge>{tag}</Badge>
            </Box>
          ))}
        </Flex>
      )}
      {!!report?.domains?.length && <p>Domains: {report.domains.join(', ')}</p>}
      <Box mt={3}>{report?.text && <FormattedMarkdown>{report.text}</FormattedMarkdown>}</Box>
    </>
  )
}

export default ReportDisplay
