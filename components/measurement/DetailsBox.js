import PropTypes from 'prop-types'
import { useCallback, useContext, useState } from 'react'
import { MdExpandLess } from 'react-icons/md'
import { twMerge } from 'tailwind-merge'
import { EmbeddedViewContext } from '../../pages/m/[measurement_uid]'

export const DetailsBoxTable = ({ title, items, className }) => (
  <DetailsBox
    title={title}
    className={className}
    content={items.map((item, index) => (
      <div className="flex flex-wrap" key={index}>
        <div className="md:w-1/4 font-bold pe-4">{item.label}</div>
        <div className="md:w-3/4 break-words">{item.value}</div>
      </div>
    ))}
  />
)

DetailsBoxTable.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
  bg: PropTypes.string,
}

export const DetailsBox = ({
  title,
  content,
  collapsed = false,
  children,
  className,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(!collapsed)

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  return (
    <div
      className={twMerge('border-2 border-gray-200 w-full my-8', className)}
      {...rest}
    >
      {title && (
        <div
          className="flex justify-between font-bold text-lg cursor-pointer px-4 py-2 bg-gray-200 items-center"
          onClick={onToggle}
        >
          {title}
          <MdExpandLess
            className={`cursor-pointer bg-white rounded-[50%] transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
            size={36}
          />
        </div>
      )}
      {isOpen && (
        <div className="p-4 flex-wrap overflow-x-auto text-sm">
          {content || children}
        </div>
      )}
    </div>
  )
}

DetailsBox.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  content: PropTypes.node,
  collapsed: PropTypes.bool,
}
