import { CgSpinner } from 'react-icons/cg'

import { twMerge } from 'tailwind-merge'

const getClassName = (classes) =>
  twMerge(
    `text-blue-500 text-5xl animate-spin
  `,
    classes,
  )

const SpinLoader = ({ className, props }) => (
  <CgSpinner className={getClassName(className)} />
)

export default SpinLoader
