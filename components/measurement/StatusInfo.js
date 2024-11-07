import PropTypes from 'prop-types'

const StatusInfo = ({ title, message }) => (
  <div className="flex flex-col">
    <div className="text-center text-2xl md:text-3xl mb-3 break-words">
      {' '}
      {title}{' '}
    </div>
    <div className="text-center text-lg font-bold whitespace-pre">
      {' '}
      {message}{' '}
    </div>
  </div>
)

StatusInfo.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
}

export default StatusInfo
