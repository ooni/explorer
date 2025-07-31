import OONILogo from 'ooni-components/svgs/logos/OONI-HorizontalMonochrome.svg'
import { useIntl } from 'react-intl'
import CountryNameLabel from './CountryNameLabel'
import { useMATContext } from './MATContext'
import { colorMap } from './colorMap'
import { testGroups, testNames } from '/components/test-info'
import { useRouter } from 'next/router'
import { blockingTypeColors } from './colorMap'
import { colors } from 'ooni-components'
import { useMemo } from 'react'

const LegendItem = ({ label, color }) => {
  return (
    <div className="flex items-center gap-1">
      <div style={{ width: '10px', height: '10px', backgroundColor: color }} />
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

const legendItemsDetailedV5 = () => {
  return [
    ...Object.entries(blockingTypeColors).flatMap(([type, states]) =>
      Object.entries(states)
        .map(([state, color]) => {
          if (state !== 'ok') {
            return {
              label: `${type}.${state}`,
              color: color,
            }
          }
        })
        .filter((item) => item !== undefined),
    ),
    {
      label: 'ok',
      color: colorMap.ok_count,
    },
  ]
}

const legendItemsOutcomeV5 = [
  {
    label: 'blocked',
    color: colorMap.confirmed_count,
  },
  {
    label: 'down',
    color: colorMap.anomaly_count,
  },
  {
    label: 'ok',
    color: colorMap.ok_count,
  },
]

const ooniColors = [
  colors.red['800'],
  colors.yellow['600'],
  colors.gray['600'],
  colors.blue['600'],
  colors.orange['600'],
  colors.fuchsia['600'],
  colors.pink['600'],
  colors.teal['600'],
]

const chartColors = (legendItems) =>
  legendItems
    .filter((f) => !['none', 'others'].includes(f))
    .reduce(
      (acc, current, i) => {
        acc[current] = ooniColors[i]
        acc.push({ label: current, color: ooniColors[i] })
        return acc
      },
      [
        { label: 'none', color: colors.green['600'] },
        { label: 'other', color: colors.gray['300'] },
      ],
    )

const Legend = () => {
  const intl = useIntl()
  const { query } = useRouter()
  const [matState] = useMATContext()

  const legendItemsObservations = useMemo(
    () => chartColors(matState.legendItems),
    [matState.legendItems],
  )

  const items =
    query.loni === 'detailed'
      ? legendItemsDetailedV5()
      : query.loni === 'outcome'
        ? legendItemsOutcomeV5
        : query.loni === 'observations'
          ? legendItemsObservations
          : legendItems

  return (
    <div className="flex my-2 gap-x-2 flex-wrap">
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
