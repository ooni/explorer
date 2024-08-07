import OONILogo from 'ooni-components/svgs/logos/OONI-HorizontalMonochrome.svg'
import { useIntl } from 'react-intl'
import CountryNameLabel from './CountryNameLabel'
import { useMATContext } from './MATContext'
import { colorMap } from './colorMap'
import { testGroups, testNames } from '/components/test-info'

const Legend = ({ label, color }) => {
  return (
    <div className="flex items-center mr-2">
      <div className="px-2">
        <div
          style={{ width: '10px', height: '10px', backgroundColor: color }}
        />
      </div>
      <div>{label}</div>
    </div>
  )
}

const getTestNameGroupName = (testNameArray) => {
  // TODO
  // show single test name
  if (testNameArray.length === 1)
    return [testNames[testNameArray[0]]?.id || testNameArray[0]]

  const testGroup = new Set()
  testNameArray.forEach((t) => {
    testNames[t]?.group && testGroup.add(testNames[t]?.group)
  })
  // if all test names belong to a single group, show group name
  if (testGroup.size === 1) {
    const testGroupName = testGroups[[...testGroup][0]].id
    return [testGroupName]
  }
  // list of multiple test names from different groups
  return testNameArray.map((t) => testNames[t].id)
}

export const SubtitleStr = ({ query }) => {
  const intl = useIntl()
  const params = new Set()

  if (query.test_name) {
    const testNameQuery = Array.isArray(query.test_name)
      ? query.test_name
      : [query.test_name]
    const testNames = getTestNameGroupName(testNameQuery)
    testNames.forEach((testName) => {
      params.add(intl.formatMessage({ id: testName, defaultMessage: '' }))
    })
  }
  if (query.domain) {
    params.add(query.domain.split(',').join(', '))
  }
  if (query.input) {
    params.add(query.input)
  }
  if (query.category_code) {
    params.add(
      intl.formatMessage({
        id: `CategoryCode.${query.category_code}.Name`,
        defaultMessage: query.category_code,
      }),
    )
  }
  if (query.probe_asn) {
    params.add(query.probe_asn)
  }

  return [...params].join(', ')
}
/**
 * ChartHeader generates formatted headings to show above the charts in GridChart
 * @param {Object} options - Object with flags for header components eg. { probe_cc: false }
 * @param {boolean} options.probe_cc - Show/hide country name
 */
export const ChartHeader = ({ options = {} }) => {
  const intl = useIntl()
  const [query] = useMATContext()

  const subTitle = <SubtitleStr query={query} />
  return (
    <>
      <div>
        {options.subtitle !== false && (
          <span className="text-2xl font-bold my-4 leading-normal">
            {subTitle}
          </span>
        )}
        {options.probe_cc !== false && query.probe_cc && (
          <span className="text-base font-bold leading-normal">
            <CountryNameLabel countryCode={query.probe_cc} />
          </span>
        )}
      </div>
      <div className="flex mb-2 justify-between text-sm">
        {options.legend !== false && (
          <div className="flex justify-center my-2 flex-wrap">
            <Legend
              label={intl.formatMessage({ id: 'MAT.Table.Header.ok_count' })}
              color={colorMap.ok_count}
            />
            <Legend
              label={intl.formatMessage({
                id: 'MAT.Table.Header.confirmed_count',
              })}
              color={colorMap.confirmed_count}
            />
            <Legend
              label={intl.formatMessage({
                id: 'MAT.Table.Header.anomaly_count',
              })}
              color={colorMap.anomaly_count}
            />
            <Legend
              label={intl.formatMessage({
                id: 'MAT.Table.Header.failure_count',
              })}
              color={colorMap.failure_count}
            />
          </div>
        )}
        <OONILogo className="opacity-50" height="32px" />
      </div>
    </>
  )
}
