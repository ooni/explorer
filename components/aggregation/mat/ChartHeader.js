import OONILogo from 'ooni-components/svgs/logos/OONI-HorizontalMonochrome.svg'
import { useIntl } from 'react-intl'
import CountryNameLabel from './CountryNameLabel'
import { useMATContext } from './MATContext'
import { colorMap } from './colorMap'
import { testGroups, testNames } from '/components/test-info'
import { useRouter } from 'next/router'

const LegendItem = ({ label, color }) => {
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
  for (const t of testNameArray) {
    testNames[t]?.group && testGroup.add(testNames[t]?.group)
  }

  // if all test names belong to a single group, show group name
  if (testGroup.size === 1) {
    const testGroupName = testGroups[[...testGroup][0]].id
    return [testGroupName]
  }
  // list of multiple test names from different groups
  return testNameArray.map((t) => testNames[t].id)
}

export const SubtitleStr = ({ query, options }) => {
  const intl = useIntl()
  const params = new Set()

  if (options.test_name && query.test_name) {
    const testNameQuery = Array.isArray(query.test_name)
      ? query.test_name
      : [query.test_name]
    const testNames = getTestNameGroupName(testNameQuery)
    for (const testName of testNames) {
      params.add(intl.formatMessage({ id: testName, defaultMessage: '' }))
    }
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

const legendItems = [
  {
    label: 'MAT.Table.Header.ok_count',
    color: colorMap.ok_count,
  },
  {
    label: 'MAT.Table.Header.confirmed_count',
    color: colorMap.confirmed_count,
  },
  {
    label: 'MAT.Table.Header.anomaly_count',
    color: colorMap.anomaly_count,
  },
  {
    label: 'MAT.Table.Header.failure_count',
    color: colorMap.failure_count,
  },
]

const legendItemsV5 = [
  {
    label: 'MAT.Table.Header.ok_count',
    color: colorMap.ok_count,
  },
  {
    label: 'MAT.Table.Header.blocked',
    color: colorMap.confirmed_count,
  },
  {
    label: 'MAT.Table.Header.down',
    color: colorMap.anomaly_count,
  },
]

const Legend = ({ label, color }) => {
  const intl = useIntl()
  const { query } = useRouter()

  const items = query.loni ? legendItemsV5 : legendItems

  return (
    <div className="flex justify-center my-2 flex-wrap">
      {items.map((item) => (
        <LegendItem
          key={item.label}
          label={intl.formatMessage({ id: item.label })}
          color={item.color}
        />
      ))}
    </div>
  )
}

/**
 * ChartHeader generates formatted headings to show above the charts in GridChart
 * @param {Object} options - Object with flags for header components eg. { probe_cc: false }
 * @param {boolean} options.probe_cc - Show/hide country name
 */
export const ChartHeader = ({ options: opts }) => {
  const intl = useIntl()
  const [query] = useMATContext()
  const options = {
    subtitle: true,
    probe_cc: true,
    test_name: true,
    legend: true,
    logo: true,
    ...opts,
  }

  const subTitle = <SubtitleStr query={query} options={options} />
  return (
    <>
      <div>
        {options.subtitle && (
          <span className="text-2xl font-bold my-4 leading-normal">
            {subTitle}
          </span>
        )}
        {options.probe_cc && query.probe_cc && (
          <span className="font-bold leading-normal">
            <CountryNameLabel countryCode={query.probe_cc} />
          </span>
        )}
      </div>
      <div className="flex mb-2 justify-between text-sm">
        {options.legend && <Legend />}
        {options.logo && <OONILogo className="opacity-50" height="32px" />}
      </div>
    </>
  )
}
