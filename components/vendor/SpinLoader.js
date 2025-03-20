// From: https://github.com/LucasBassetti/react-css-loaders/tree/master/lib/spin

import { twMerge } from 'tailwind-merge'

const getClassName = (classes) =>
  twMerge(
    `h-12
    w-12
    animate-spin
    bg-white 
    text-blue-500 
    duration-150 
    my-[50px] 
    mx-auto 
    rounded-[50%]
    bg-gradient-to-r
    from-blue-500
    from-10%
    to-transparent
    to-45%
    before:content-['']
    before:bg-blue-500
    before:rounded-[100%_0_0_0]
    before:h-[50%]
    before:w-[50%]
    before:left-0  
    before:top-0
    before:absolute
    after:content-['']
    after:bg-white
    after:rounded-[50%]
    after:bottom-0
    after:top-0
    after:left-0
    after:right-0
    after:m-auto
    after:h-[75%]
    after:w-[75%]
    after:absolute
  `,
    classes,
  )

const SpinLoader = ({ className, props }) => (
  <div className={getClassName(className)} {...props} />
)

export default SpinLoader
