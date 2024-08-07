import * as icons from 'ooni-components/icons'
import PropTypes from 'prop-types'
import { cloneElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { twMerge } from 'tailwind-merge'
import { getTestMetadata } from './utils'

export const Badge = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        'inline-block rounded py-1 px-2 leading-4 text-xs uppercase bg-gray-800 text-white font-semibold tracking-wide',
        className,
      )}
      {...props}
    />
  )
}

const TestGroupBadge = ({ testName, ...props }) => {
  const { icon, groupName, color } = getTestMetadata(testName)

  return (
    <Badge style={{ backgroundColor: color }} {...props}>
      <div className="flex gap-1 items-center">
        <div>{groupName}</div>
        {cloneElement(icon, { size: 12 })}
      </div>
    </Badge>
  )
}

export const CategoryBadge = ({ categoryCode }) => {
  let IconComponent
  try {
    IconComponent = icons[`CategoryCode${categoryCode}`]
  } catch {
    IconComponent = null
  }

  return (
    <Badge className="bg-white border border-gray-500 text-gray-700">
      <div className="flex gap-1 items-center">
        <div>
          <FormattedMessage id={`CategoryCode.${categoryCode}.Name`} />
        </div>
        {IconComponent && <IconComponent size={15} />}
      </div>
    </Badge>
  )
}

TestGroupBadge.propTypes = {
  testName: PropTypes.string.isRequired,
}

export default TestGroupBadge
