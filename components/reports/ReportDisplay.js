import { Heading, Flex, Box } from 'ooni-components'
import { Badge } from 'components/Badge'
import Markdown from 'markdown-to-jsx'
import { MATChartReportWrapper } from 'components/MATChart'

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
  return (
    <>
      <Heading h={1}>{report?.title}</Heading>
      {/* <p>Published: {report.published}</p> */}
      <p>Created by {report?.reported_by}</p>
      <p>Start time: {report?.start_time}</p>
      <p>End time: {report?.end_time}</p>
      {!!report?.tags?.length && (
        <Flex>
          {report.tags.map((tag) => (
            <Box key={tag} mr={2}>
              <Badge>{tag}</Badge>
            </Box>
          ))}
        </Flex>
      )}
      {!!report?.ASNs?.length && <p>ASNs: {report.ASNs.join(', ')}</p>}
      {!!report?.CCs?.length && <p>Countries: {report.CCs.join(', ')}</p>}
      {!!report?.domains?.length && <p>Domains: {report.domains.join(', ')}</p>}
      <Box mt={3}>{report?.text && <FormattedMarkdown>{report.text}</FormattedMarkdown>}</Box>
    </>
  )
}

export default ReportDisplay
