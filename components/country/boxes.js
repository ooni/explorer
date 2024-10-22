import PropTypes from 'prop-types'
import { twMerge } from 'tailwind-merge'

export const SimpleBox = ({ children }) => (
  <div className="border border-gray-400 px-4 py-2">{children}</div>
)

export const BoxWithTitle = ({ title, children, className }) => (
  <section
    className={twMerge('container border border-gray-400 my-8 p-4', className)}
  >
    <h3 className="mb-4">{title}</h3>
    {children}
  </section>
)

BoxWithTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  children: PropTypes.node,
}
