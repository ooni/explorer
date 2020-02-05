import { testGroups, testNames } from './test-info'

export const getTestMetadata = (testName) => {
  let metadata = {
    'name': testName,
    'groupName': testGroups.default.name,
    'color': testGroups.default.color,
    'icon': testGroups.default.icon,
    'info': 'https://ooni.org/nettest/'
  }

  const test = testNames[testName]
  if (test === undefined) {
    return metadata
  }
  const group = testGroups[test.group]
  metadata['name'] = test.name
  metadata['groupName'] = group.name
  metadata['icon'] = group.icon
  metadata['color'] = group.color
  metadata['info'] = test.info
  return metadata
}
