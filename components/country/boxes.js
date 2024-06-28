import PropTypes from 'prop-types'

export const SimpleBox = ({ children }) => (
  <div className="border border-gray-500 px-4 py-2">{children}</div>
)

export const BoxWithTitle = ({ title, children }) => (
  <div className="border border-gray-500 my-8 py-4">
    <div className="container mx-auto">
      <div className="mb-4 text-xl font-semibold">{title}</div>
      {children}
    </div>
  </div>
)

BoxWithTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  children: PropTypes.node,
}
