import OONILogo from 'ooni-components/svgs/logos/OONI-HorizontalMonochrome.svg'
import { FaEdit } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import CountryNameLabel from './CountryNameLabel'
import { testGroups, testNames } from '/components/test-info'
import { useState, useMemo } from 'react'
import { useMATContext } from './MATContext'
import FailureForm from './FailureForm'
import { MdClose } from 'react-icons/md'

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

const Legend = () => {
  const intl = useIntl()
  const { state } = useMATContext()
  const { query, legendItems } = state

  const [showLegendEditor, setShowLegendEditor] = useState(false)

  return (
    <>
      {showLegendEditor ? (
        <div className="bg-gray-100 p-4 rounded-md block w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Chart editor</span>
            <button
              type="button"
              className="text-md px-2"
              onClick={() => setShowLegendEditor(false)}
            >
              <MdClose />
            </button>
          </div>
          <div>
            <FailureForm afterSubmit={() => setShowLegendEditor(false)} />
          </div>
        </div>
      ) : (
        <div className="group flex my-2 gap-x-2 flex-wrap items-center">
          {!!legendItems?.length &&
            legendItems.map((item) => (
              <LegendItem
                key={item.label}
                label={intl.messages[item.label] || item.label}
                color={item.color}
              />
            ))}
          {state.showLegendEditorButton && (
            <button
              type="button"
              aria-label="Edit legend"
              className="opacity-0 text-blue-500 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
              onClick={() => setShowLegendEditor(true)}
            >
              <FaEdit size={12} />
            </button>
          )}
        </div>
      )}
    </>
  )
}

/**
 * ChartHeader generates formatted headings to show above the charts in GridChart
 * @param {Object} options - Object with flags for header components eg. { probe_cc: false }
 * @param {boolean} options.probe_cc - Show/hide country name
 */
export const ChartHeader = ({ options: opts }) => {
  const { state } = useMATContext()
  const { query } = state

  const intl = useIntl()

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
      <div className="flex mb-2 justify-between text-sm gap-x-6">
        {options.legend && <Legend />}
        {options.logo && (
          <div>
            <OONILogo className="opacity-50" height="32px" />
          </div>
        )}
      </div>
    </>
  )
}
