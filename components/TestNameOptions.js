import { useIntl } from 'react-intl'
import { testGroups, testNames as testNamesIntl } from '../components/test-info'

export const TestNameOptions = ({ testNames, includeAllOption = true}) => {
  const intl = useIntl()
  const groupedTestNameOptions = testNames
    .reduce((grouped, test) => {
      const group = test.id in testNamesIntl ? testNamesIntl[test.id].group : 'legacy'
      const option = {
        id: test.id,
        name: test.name,
        intlKey: testNamesIntl[test.id]?.id,
        group
      }
      if (group in grouped) {
        grouped[group].push(option)
      } else {
        grouped[group] = [option]
      }
      return grouped
    }, {})

  const sortedGroupedTestNameOptions = new Map()

  for (const group of Object.keys(testGroups).values()) {
    if (group in groupedTestNameOptions) {
      sortedGroupedTestNameOptions.set(group, groupedTestNameOptions[group])
    }
  }

  return ([
    // Optinally insert an 'Any' option to test name filter
    includeAllOption && <option key='XX' value='XX'>{intl.formatMessage({id: 'Search.Sidebar.TestName.AllTests'})}</option>,
    [...sortedGroupedTestNameOptions].map(([group, tests]) => {
      const groupName = group in testGroups ? intl.formatMessage({id: testGroups[group].id}) : group
      const testOptions = tests.map(({id, name, intlKey}) => {
        return <option key={id} value={id}>{intlKey ? intl.formatMessage({id: intlKey}) : name}</option>
    })
      return [<optgroup key={group} label={groupName} />, ...testOptions]
    })
  ])
}